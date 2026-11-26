"""Uji API: pip install httpx pytest, lalu jalankan: pytest services/api"""
from fastapi.testclient import TestClient

import ai
from main import app

c = TestClient(app)


def test_health():
    assert c.get("/health").json()["status"] == "ok"


def test_ai_tanpa_key(monkeypatch):
    monkeypatch.delenv("DEEPSEEK_API_KEY", raising=False)
    r = c.post("/ai", json={"mode": "tanya", "pesan": "Apa itu rasio?"})
    assert r.status_code == 503 and "API key" in r.json()["detail"]


def test_ai_mediasi(monkeypatch):
    terkirim = {}

    def palsu(messages):
        terkirim["m"] = messages
        return "Coba lihat: berapa kali bakteri membelah dalam 2 jam?"

    monkeypatch.setattr(ai, "panggil_ai", palsu)
    r = c.post("/ai", json={
        "mode": "mediasi", "pesan": "aku bingung",
        "konteks": {"tahap_rmt": 3, "judul": "Pembelahan bakteri", "kunci": "320", "jawaban_siswa": ["160"]},
        "riwayat": [{"role": "user", "content": "halo"}, {"role": "assistant", "content": "Halo!"}],
    })
    assert r.status_code == 200 and "membelah" in r.json()["jawaban"]
    sistem = terkirim["m"][0]["content"]
    assert "Rigorous Mathematical Thinking" in sistem and "Tahap 3" in sistem and "JANGAN disebutkan" in sistem
    assert [m["role"] for m in terkirim["m"]] == ["system", "user", "assistant", "user"]


def test_format_permintaan_deepseek(monkeypatch):
    import io
    import json as js

    dikirim = {}

    class Res(io.BytesIO):
        def __enter__(self): return self
        def __exit__(self, *a): pass

    def urlopen_palsu(req, timeout=0):
        dikirim.update(url=req.full_url, auth=req.get_header("Authorization"), body=js.loads(req.data))
        return Res(js.dumps({"choices": [{"message": {"content": " Halo! "}}]}).encode())

    monkeypatch.setenv("DEEPSEEK_API_KEY", "sk-uji")
    monkeypatch.delenv("DEEPSEEK_MODEL", raising=False)
    monkeypatch.setattr(ai.urllib.request, "urlopen", urlopen_palsu)
    assert ai.panggil_deepseek([{"role": "user", "content": "x"}]) == "Halo!"
    assert dikirim["url"] == "https://api.deepseek.com/chat/completions"
    assert dikirim["auth"] == "Bearer sk-uji"
    assert dikirim["body"]["model"] == "deepseek-flash" and dikirim["body"]["max_tokens"] == 400


def test_ai_mode_salah():
    assert c.post("/ai", json={"mode": "lain"}).status_code == 400


def test_batas_pemakaian(monkeypatch):
    monkeypatch.setenv("AI_BATAS_PER_10_MENIT", "2")
    ai._per_ip.clear()
    ai.cek_batas("1.1.1.1", 1000)
    ai.cek_batas("1.1.1.1", 1001)
    try:
        ai.cek_batas("1.1.1.1", 1002)
        assert False, "harus ditolak"
    except ai.GalatAI as e:
        assert e.status == 429
    ai.cek_batas("1.1.1.1", 1700)  # setelah 10 menit boleh lagi


def test_geometri():
    assert c.get("/geometri", params={"a": 3, "r": 2, "n": 8}).json() == {"U_n": 384.0, "S_n": 765.0}


def test_analisis():
    data = {
        "records": [
            {"kode_siswa": "A", "soal_id": "G01", "benar": 1, "waktu_detik": 60, "butuh_bantuan": 0, "persepsi": 1, "paas": 2},
            {"kode_siswa": "B", "soal_id": "G01", "benar": 0, "waktu_detik": 90, "butuh_bantuan": 1, "persepsi": "", "paas": 6},
            {"kode_siswa": "A", "soal_id": "G10", "benar": 0, "waktu_detik": 200, "butuh_bantuan": 1, "persepsi": 4, "paas": 9},
        ],
        "angket": [{"jenis": "sus", "respon": [5, 1, 5, 1, 5, 1, 5, 1, 5, 1]}],
    }
    h = c.post("/analisis", json=data).json()
    g01 = h["butir"]["soal"][0]
    assert g01["soal_id"] == "G01" and g01["p"] == 0.5 and g01["kategori"] == "sedang"
    assert h["butir"]["soal"][1]["rekomendasi"].startswith("SEDERHANAKAN")
    assert h["angket"]["sus"]["rata"] == 100


def _bersihkan_env(monkeypatch):
    for k in ["AI_PROVIDER", "AI_API_KEY", "AI_MODEL", "AI_BASE_URL", "DEEPSEEK_API_KEY", "DEEPSEEK_MODEL", "DEEPSEEK_BASE_URL"]:
        monkeypatch.delenv(k, raising=False)
    ai._cache_model.update(kunci=None, waktu=0, daftar=[])


def test_pilih_model_gratis_otomatis():
    ids = ["openai/gpt-x", "liquid/lfm-3-1.7b:free", "google/gemma-4-31b-it:free", "nvidia/nemotron-3-ultra-550b-a55b:free",
           "nvidia/nemotron-3.5-super-vl:free", "baidu/ernie-5.5-flash-preview:free"]
    p = ai.pilih_model(ids, gratis_saja=True)
    assert p[0] == "google/gemma-4-31b-it:free" and p[1] == "nvidia/nemotron-3-ultra-550b-a55b:free"
    assert all(i.endswith(":free") for i in p) and "liquid/lfm-3-1.7b:free" not in p
    assert ai.pilih_model(ids + ["deepseek/deepseek-v4:free"], True)[0] == "deepseek/deepseek-v4:free"


def test_openrouter_cadangan_saat_kuota_habis(monkeypatch):
    import io
    import json as js
    import urllib.error

    _bersihkan_env(monkeypatch)
    monkeypatch.setenv("AI_PROVIDER", "openrouter")
    monkeypatch.setenv("AI_API_KEY", "sk-or-uji")
    dicoba = []

    class Res(io.BytesIO):
        def __enter__(self): return self
        def __exit__(self, *a): pass

    def urlopen_palsu(req, timeout=0):
        if req.full_url.endswith("/models"):
            assert req.get_header("Authorization") == "Bearer sk-or-uji"
            return Res(js.dumps({"data": [{"id": "google/gemma-4-31b-it:free"}, {"id": "nvidia/nemotron-3-ultra-550b-a55b:free"}, {"id": "openai/gpt-x"}]}).encode())
        body = js.loads(req.data)
        dicoba.append(body["model"])
        assert req.full_url == "https://openrouter.ai/api/v1/chat/completions" and "thinking" not in body
        if body["model"].startswith("google/"):
            raise urllib.error.HTTPError(req.full_url, 429, "rate limited", {}, None)
        return Res(js.dumps({"choices": [{"message": {"content": "Coba hitung 6 : 3."}}]}).encode())

    monkeypatch.setattr(ai.urllib.request, "urlopen", urlopen_palsu)
    assert ai.panggil_ai([{"role": "user", "content": "x"}]) == "Coba hitung 6 : 3."
    assert dicoba == ["google/gemma-4-31b-it:free", "nvidia/nemotron-3-ultra-550b-a55b:free"]
    s = c.get("/ai/status").json()
    assert s["aktif"] is True and s["penyedia"] == "OpenRouter"


def test_ollama_tanpa_key(monkeypatch):
    _bersihkan_env(monkeypatch)
    monkeypatch.setenv("AI_PROVIDER", "ollama")
    assert ai.aktif() is True and ai.konfigurasi()["url"] == "http://localhost:11434/v1"