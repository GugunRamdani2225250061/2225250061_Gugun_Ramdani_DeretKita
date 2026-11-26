"""
DeretKita API (Python / FastAPI): bagian STATISTIK aplikasi.

Jalankan:
    cd services/api
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
Dokumentasi otomatis: http://localhost:8000/docs
"""
import json
import os
import sys
import urllib.request
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import ai

# memakai fungsi yang sama dengan skrip penelitian di folder analisis/
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "analisis"))
from analisis_uji_coba import hitung  # noqa: E402
from angket import ringkas_angket  # noqa: E402
from deret_geometri import suku_ke_n, jumlah_n  # noqa: E402

app = FastAPI(title="DeretKita API", version="0.2.0")
_asal = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",") if o.strip()]
app.add_middleware(CORSMiddleware, allow_origins=_asal, allow_methods=["*"], allow_headers=["*"])


@app.middleware("http")
async def izin_jaringan_lokal(request: Request, call_next):
    # agar web online (https://...github.io) boleh memanggil server di laptop (localhost)
    res = await call_next(request)
    res.headers["Access-Control-Allow-Private-Network"] = "true"
    return res


class DataAnalisis(BaseModel):
    records: list[dict] = []  # baris jawaban (format CSV uji coba)
    angket: list[dict] = []  # [{'jenis': 'sus'|'leppink', 'respon': [...]}]


@app.get("/health")
def health():
    return {"status": "ok", "ai": ai.aktif()}


# ---------------- Kak Deret (DeepSeek) ----------------
class PermintaanAI(BaseModel):
    mode: str = "mediasi"  # mediasi | refleksi | tanya
    konteks: dict = {}
    pesan: str = Field("", max_length=500)
    riwayat: list[dict] = []


@app.get("/ai/status")
def ai_status():
    cfg = ai.konfigurasi()
    return {"aktif": ai.aktif(), "penyedia": cfg["nama"], "model": cfg["model"] or "otomatis (model gratis terbaik)"}


@app.post("/ai")
def tanya_ai(data: PermintaanAI, request: Request):
    """Dipanggil tombol 'Tanya Kak Deret' di aplikasi."""
    try:
        messages = ai.susun_pesan(data.mode, data.konteks, data.pesan, data.riwayat)
        ai.cek_batas(request.client.host if request.client else "?")
        return {"jawaban": ai.panggil_ai(messages)}
    except ValueError as e:
        raise HTTPException(400, str(e))
    except ai.GalatAI as e:
        raise HTTPException(e.status, e.pesan)


@app.post("/analisis")
def analisis(data: DataAnalisis):
    """Dipanggil dari tombol 'Analisis dengan Python' di Dasbor."""
    return {"butir": hitung(data.records), "angket": ringkas_angket(data.angket)}


@app.get("/geometri")
def geometri(a: float, r: float, n: int):
    """Contoh: /geometri?a=3&r=2&n=8 -> suku ke-n dan jumlah n suku"""
    if n < 1 or n > 200:
        raise HTTPException(400, "n harus 1..200")
    return {"U_n": float(suku_ke_n(a, r, n)), "S_n": float(jumlah_n(a, r, n))}


def _ambil_supabase(tabel):
    url, key = os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise HTTPException(503, "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi di .env server")
    req = urllib.request.Request(
        f"{url}/rest/v1/{tabel}?select=*",
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.load(res)


@app.get("/analisis/supabase")
def analisis_supabase(kode_kelas: str | None = None):
    """Analisis semua data kelas yang tersimpan online di Supabase."""
    rows = _ambil_supabase("jawaban")
    if kode_kelas:
        rows = [r for r in rows if (r.get("kode_kelas") or "").upper() == kode_kelas.upper()]
    records = [{**r, "benar": int(bool(r.get("benar"))), "butuh_bantuan": int(bool(r.get("butuh_bantuan")))} for r in rows]
    angket = _ambil_supabase("angket")
    return {"butir": hitung(records), "angket": ringkas_angket(angket)}
