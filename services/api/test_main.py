"""Uji API: pip install httpx pytest, lalu jalankan: pytest services/api"""
from fastapi.testclient import TestClient

from main import app

c = TestClient(app)


def test_health():
    assert c.get("/health").json() == {"status": "ok"}


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
