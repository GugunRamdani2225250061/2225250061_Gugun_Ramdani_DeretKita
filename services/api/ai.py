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


# ---------- Penyedia AI (semua memakai format OpenAI /chat/completions) ----------
# Pilih lewat .env:  AI_PROVIDER=openrouter | deepseek | groq | gemini | ollama
PENYEDIA = {
    "openrouter": {"nama": "OpenRouter", "url": "https://openrouter.ai/api/v1", "gratis": True,
                   "header": {"X-OpenRouter-Title": "DeretKita"}},
    "deepseek": {"nama": "DeepSeek", "url": "https://api.deepseek.com", "model": MODEL_DEFAULT,
                 "tambahan": {"thinking": {"type": "disabled"}}},  # jawaban cepat & hemat
    "groq": {"nama": "Groq", "url": "https://api.groq.com/openai/v1"},
    "gemini": {"nama": "Google Gemini", "url": "https://generativelanguage.googleapis.com/v1beta/openai"},
    "ollama": {"nama": "Ollama (laptop)", "url": "http://localhost:11434/v1", "tanpa_key": True},
}
# urutan model yang diutamakan saat memilih otomatis (DeepSeek dulu, lalu model besar yang bagus)
PREFERENSI = ["deepseek", "gemma-4-31b", "nemotron-3-ultra", "nemotron-3.5-super", "gemini", "gpt-oss",
              "llama-4", "llama-3.3-70b", "qwen", "gemma", "llama", "mistral", "nemotron"]
TOLAK = ["whisper", "tts", "embed", "guard", "audio", "image", "moderation", "1.7b", "-1b", "omni", "vl", "reasoning"]


def konfigurasi():
    """Membaca pilihan penyedia dari .env. Kompatibel dengan pengaturan lama (DEEPSEEK_*)."""
    kode = os.getenv("AI_PROVIDER", "").strip().lower()
    if not kode:
        kode = "deepseek" if os.getenv("DEEPSEEK_API_KEY", "").strip() and not os.getenv("AI_API_KEY", "").strip() else "openrouter"
    p = PENYEDIA.get(kode, PENYEDIA["openrouter"])
    key = os.getenv("AI_API_KEY", "").strip() or (os.getenv("DEEPSEEK_API_KEY", "").strip() if kode == "deepseek" else "")
    url = (os.getenv("AI_BASE_URL", "") or (os.getenv("DEEPSEEK_BASE_URL", "") if kode == "deepseek" else "")).strip().rstrip("/") or p["url"]
    model = os.getenv("AI_MODEL", "").strip() or (os.getenv("DEEPSEEK_MODEL", "").strip() if kode == "deepseek" else "") or p.get("model", "")
    return {"kode": kode, "nama": p["nama"], "url": url, "key": key, "model": model, "penyedia": p}


def _minta(url, key, body=None, header=None, timeout=45):
    h = {"Content-Type": "application/json", **(header or {})}
    if key:
        h["Authorization"] = f"Bearer {key}"
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, headers=h,
                                 method="POST" if body is not None else "GET")
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return json.load(res)


_cache_model = {"kunci": None, "waktu": 0, "daftar": []}


def pilih_model(ids, gratis_saja):
    """Memilih maksimal 3 model terbaik dari daftar id (untuk cadangan bila kuota satu model habis)."""
    kandidat = [i for i in ids if (i.endswith(":free") or not gratis_saja) and not any(t in i.lower() for t in TOLAK)]
    def skor(i):
        low = i.lower()
        return next((n for n, kata in enumerate(PREFERENSI) if kata in low), len(PREFERENSI))
    return sorted(kandidat, key=skor)[:3]


def daftar_model(cfg):
    if cfg["model"]:
        return [m.strip() for m in cfg["model"].split(",") if m.strip()]
    kunci = (cfg["kode"], cfg["url"])
    if _cache_model["kunci"] == kunci and time.time() - _cache_model["waktu"] < 3600 and _cache_model["daftar"]:
        return _cache_model["daftar"]
    try:
        data = _minta(f"{cfg['url']}/models", cfg["key"], timeout=20)
        ids = [m.get("id", "") for m in data.get("data", [])]
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            raise GalatAI(502, f"API key {cfg['nama']} salah atau sudah dihapus.") from e
        raise GalatAI(502, f"{cfg['nama']} menolak permintaan daftar model (kode {e.code}).") from e
    except (urllib.error.URLError, TimeoutError, ValueError) as e:
        raise GalatAI(504, f"Tidak bisa mengambil daftar model dari {cfg['nama']}.") from e
    pilihan = pilih_model([i.removeprefix("models/") for i in ids], cfg["penyedia"].get("gratis", False))
    if not pilihan:
        raise GalatAI(503, f"Tidak ada model gratis yang cocok di {cfg['nama']} saat ini.")
    _cache_model.update(kunci=kunci, waktu=time.time(), daftar=pilihan)
    return pilihan


def panggil_ai(messages):
    """Memanggil penyedia AI yang dipilih. Jika kuota/model gagal, mencoba model cadangan."""
    cfg = konfigurasi()
    if not cfg["key"] and not cfg["penyedia"].get("tanpa_key"):
        raise GalatAI(503, f"API key {cfg['nama']} belum diisi di file .env server (AI_API_KEY).")
    galat = None
    for model in daftar_model(cfg):
        body = {"model": model, "messages": messages, "max_tokens": 400, "temperature": 0.5, "stream": False,
                **cfg["penyedia"].get("tambahan", {})}
        try:
            data = _minta(f"{cfg['url']}/chat/completions", cfg["key"], body, cfg["penyedia"].get("header"))
            teks = (data["choices"][0]["message"].get("content") or "").strip()
            if teks:
                return teks
            galat = GalatAI(502, "AI tidak memberi jawaban. Coba lagi.")
        except urllib.error.HTTPError as e:
            if e.code in (401, 403):
                raise GalatAI(502, f"API key {cfg['nama']} salah atau sudah dihapus.") from e
            if e.code == 402:
                raise GalatAI(502, f"Saldo {cfg['nama']} habis.") from e
            # 429 (kuota habis), 404/400 (model tidak tersedia), 5xx -> coba model berikutnya
            galat = GalatAI(429 if e.code == 429 else 502,
                            "Kuota AI gratis sedang habis. Coba lagi beberapa menit lagi." if e.code == 429
                            else f"{cfg['nama']} menolak permintaan (kode {e.code}).")
        except (urllib.error.URLError, TimeoutError) as e:
            galat = GalatAI(504, f"Tidak bisa terhubung ke {cfg['nama']}. Periksa internet server.")
        except (KeyError, IndexError, TypeError, ValueError):
            galat = GalatAI(502, "Jawaban AI tidak bisa dibaca.")
    _cache_model["daftar"] = []  # pilih ulang model pada permintaan berikutnya
    raise galat or GalatAI(502, "AI tidak bisa dihubungi.")


panggil_deepseek = panggil_ai  # nama lama (kompatibel)


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
    cfg = konfigurasi()
    return bool(cfg["key"]) or bool(cfg["penyedia"].get("tanpa_key"))
