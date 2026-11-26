"""
Kak Deret: tutor AI (DeepSeek) yang berperan sebagai MEDIATOR dalam model
Rigorous Mathematical Thinking (RMT; Kinard & Kozulin, 2008).

API key DeepSeek HANYA disimpan di server (file .env / pengaturan hosting),
tidak pernah dikirim ke browser.
    DEEPSEEK_API_KEY=sk-...
    DEEPSEEK_MODEL=deepseek-flash   (opsional)
"""
import json
import os
import time
import urllib.error
import urllib.request
from collections import defaultdict, deque

URL_DEEPSEEK = "https://api.deepseek.com/chat/completions"
MODEL_DEFAULT = "deepseek-flash"

TAHAP_RMT = {
    1: ("Pengembangan Kognitif",
        "fungsi kognitif KUALITATIF: memberi nama/label, mengamati, membandingkan, mencari informasi secara sistematis"),
    2: ("Konten sebagai Proses",
        "fungsi kognitif KUANTITATIF dan TEPAT: menganalisis, menjaga keajegan (rasio tetap), menghitung dengan teliti, memakai simbol a, r, n"),
    3: ("Praktik Konstruksi Kognitif Konseptual",
        "fungsi kognitif RELASIONAL-ABSTRAK: menemukan hubungan, menggeneralisasi, berpikir hipotetis, memeriksa bukti logis dan kewajaran hasil"),
}

PROMPT_DASAR = """Kamu adalah "Kak Deret", tutor matematika untuk siswa SMP di Indonesia pada materi barisan dan deret geometri dalam kehidupan sehari-hari.

Kamu bekerja sebagai MEDIATOR dalam model Rigorous Mathematical Thinking (RMT, Kinard & Kozulin) yang berlandaskan pengalaman belajar termediasi (Feuerstein) dan teori Vygotsky:
- Intensionalitas & resiprositas: fokuskan perhatian siswa pada SATU hal penting, lalu ajak siswa merespons.
- Makna: jelaskan mengapa langkah itu penting.
- Transendensi: kaitkan dengan situasi lain di kehidupan sehari-hari.
- Gunakan alat psikologis: tabel, diagram, pola, simbol (a = suku pertama, r = rasio, n = urutan suku).

ATURAN WAJIB:
1. JANGAN memberikan jawaban akhir atau kunci jawaban soal. Bimbing dengan pertanyaan pemandu.
2. Jawaban SINGKAT: paling banyak 60 kata, maksimal 1-2 pertanyaan pemandu. (Siswa tidak boleh kelebihan beban kognitif.)
3. Bahasa Indonesia sederhana, ramah, menyemangati. Tanpa istilah sulit kecuali dijelaskan.
4. Matematika harus benar. Rumus: Un = a·r^(n-1); Sn = a(r^n - 1)/(r - 1) untuk r > 1, Sn = a(1 - r^n)/(1 - r) untuk 0 < r < 1.
5. Hanya membahas matematika/pelajaran. Jika siswa bertanya hal lain, arahkan kembali dengan sopan.
6. Jangan meminta data pribadi siswa.
7. Tulis pangkat sebagai 2³ atau 2^5; jangan pakai LaTeX."""

PANDUAN_MODE = {
    "mediasi": "Siswa sedang mengerjakan langkah soal. Bantu siswa berpikir sendiri. Jika jawaban siswa salah, tunjukkan BAGIAN cara berpikir yang perlu dicek, tanpa menyebut jawaban benar.",
    "refleksi": "Siswa menulis refleksi akhir modul. Beri tanggapan: (1) satu pujian yang spesifik, (2) luruskan miskonsepsi jika ada, (3) satu pertanyaan transendensi yang mengaitkan konsep dengan kehidupan sehari-hari. Maksimal 70 kata.",
    "tanya": "Siswa bertanya bebas tentang barisan & deret geometri. Boleh menjelaskan konsep dengan contoh sehari-hari, tetapi tetap akhiri dengan satu pertanyaan agar siswa ikut berpikir. Maksimal 90 kata. Jika siswa meminta jawaban soal, bimbing langkahnya saja.",
}


def susun_pesan(mode, konteks, pesan, riwayat):
    """Membuat daftar messages untuk API (format OpenAI-compatible)."""
    if mode not in PANDUAN_MODE:
        raise ValueError("mode tidak dikenal")
    sistem = PROMPT_DASAR + "\n\nTUGAS SAAT INI: " + PANDUAN_MODE[mode]

    k = konteks or {}
    tahap = k.get("tahap_rmt")
    if tahap in TAHAP_RMT:
        nama, fungsi = TAHAP_RMT[tahap]
        sistem += f"\n\nTahap RMT siswa: Tahap {tahap} ({nama}). Kembangkan {fungsi}."

    info = []
    for label, kunci in [("Modul", "modul"), ("Judul soal", "judul"), ("Cerita soal", "cerita"),
                         ("Langkah literasi", "langkah"), ("Pertanyaan", "pertanyaan"),
                         ("Pilihan jawaban", "opsi"), ("Jawaban siswa sejauh ini", "jawaban_siswa"),
                         ("Pertanyaan refleksi", "pertanyaan_refleksi")]:
        v = k.get(kunci)
        if v not in (None, "", []):
            info.append(f"{label}: {v if not isinstance(v, list) else '; '.join(map(str, v))}")
    if k.get("kunci") not in (None, ""):
        info.append(f"(RAHASIA, hanya untuk memeriksa, JANGAN disebutkan ke siswa) Jawaban benar: {k['kunci']}")
    if info:
        sistem += "\n\nKONTEKS:\n" + "\n".join(info)

    messages = [{"role": "system", "content": sistem}]
    for r in (riwayat or [])[-6:]:
        if r.get("role") in ("user", "assistant") and r.get("content"):
            messages.append({"role": r["role"], "content": str(r["content"])[:600]})
    messages.append({"role": "user", "content": (pesan or "Aku bingung, bantu aku mulai.").strip()[:500]})
    return messages


class GalatAI(Exception):
    def __init__(self, status, pesan):
        super().__init__(pesan)
        self.status = status
        self.pesan = pesan


def panggil_deepseek(messages):
    """Memanggil DeepSeek. Dipisah agar mudah diganti saat pengujian."""
    key = os.getenv("DEEPSEEK_API_KEY", "").strip()
    if not key:
        raise GalatAI(503, "API key DeepSeek belum diisi di file .env server (DEEPSEEK_API_KEY).")
    body = {
        "model": os.getenv("DEEPSEEK_MODEL", MODEL_DEFAULT),
        "messages": messages,
        "max_tokens": 400,
        "temperature": 0.5,
        "thinking": {"type": "disabled"},  # jawaban cepat & hemat
        "stream": False,
    }
    dasar = os.getenv("DEEPSEEK_BASE_URL", "").strip().rstrip("/")
    req = urllib.request.Request(
        f"{dasar}/chat/completions" if dasar else URL_DEEPSEEK,
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as res:
            data = json.load(res)
    except urllib.error.HTTPError as e:
        pesan = {
            401: "API key DeepSeek salah atau sudah dihapus.",
            402: "Saldo DeepSeek habis. Isi saldo di platform.deepseek.com.",
            429: "Terlalu banyak permintaan ke DeepSeek. Tunggu sebentar.",
        }.get(e.code, f"DeepSeek menolak permintaan (kode {e.code}).")
        raise GalatAI(502, pesan) from e
    except (urllib.error.URLError, TimeoutError) as e:
        raise GalatAI(504, "Tidak bisa terhubung ke DeepSeek. Periksa internet server.") from e
    try:
        return data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError) as e:
        raise GalatAI(502, "Jawaban DeepSeek tidak bisa dibaca.") from e


# ---------- pembatas pemakaian (melindungi saldo) ----------
_per_ip = defaultdict(deque)
_harian = {"tanggal": None, "jumlah": 0}


def cek_batas(ip, sekarang=None):
    sekarang = sekarang or time.time()
    batas_ip = int(os.getenv("AI_BATAS_PER_10_MENIT", "20"))
    batas_hari = int(os.getenv("AI_BATAS_HARIAN", "1000"))
    hari = time.strftime("%Y-%m-%d", time.localtime(sekarang))
    if _harian["tanggal"] != hari:
        _harian.update(tanggal=hari, jumlah=0)
    if _harian["jumlah"] >= batas_hari:
        raise GalatAI(429, "Kuota Kak Deret hari ini sudah habis. Coba lagi besok.")
    q = _per_ip[ip]
    while q and sekarang - q[0] > 600:
        q.popleft()
    if len(q) >= batas_ip:
        raise GalatAI(429, "Kamu sudah banyak bertanya. Coba pikirkan dulu, lalu tanya lagi beberapa menit lagi.")
    q.append(sekarang)
    _harian["jumlah"] += 1


def aktif():
    return bool(os.getenv("DEEPSEEK_API_KEY", "").strip())
