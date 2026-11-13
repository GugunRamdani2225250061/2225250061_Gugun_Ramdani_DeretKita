"""
Skor angket: SUS (Brooke, 1996) dan beban kognitif (adaptasi Leppink dkk., 2013).
Format respon = daftar 10 angka sesuai urutan butir di docs/INSTRUMEN.md.
"""
import statistics as st


def skor_sus(respon):
    """Butir ganjil: skor - 1, butir genap: 5 - skor, jumlah x 2,5 -> 0..100"""
    if len(respon) != 10:
        raise ValueError("SUS harus 10 butir")
    return sum((v - 1) if i % 2 == 0 else (5 - v) for i, v in enumerate(respon)) * 2.5


def skor_leppink(respon):
    """IL = butir 1-3, EL = butir 4-6, GL = butir 7-10 (skala 0-10)"""
    if len(respon) != 10:
        raise ValueError("Angket Leppink harus 10 butir")
    return {"IL": st.mean(respon[0:3]), "EL": st.mean(respon[3:6]), "GL": st.mean(respon[6:10])}


def kategori_sus(skor):
    if skor >= 80.3:
        return "sangat baik"
    if skor >= 68:
        return "baik (dapat diterima)"
    if skor >= 51:
        return "cukup"
    return "kurang"


def ringkas_angket(daftar):
    """daftar: [{'jenis': 'sus'|'leppink', 'respon': [..10 angka..]}, ...]"""
    sus = [skor_sus(a["respon"]) for a in daftar if a.get("jenis") == "sus"]
    lep = [skor_leppink(a["respon"]) for a in daftar if a.get("jenis") == "leppink"]
    hasil = {"sus": None, "leppink": None}
    if sus:
        m = st.mean(sus)
        hasil["sus"] = {"n": len(sus), "rata": m, "kategori": kategori_sus(m)}
    if lep:
        hasil["leppink"] = {"n": len(lep), **{k: st.mean(x[k] for x in lep) for k in ("IL", "EL", "GL")}}
    return hasil


if __name__ == "__main__":
    print(skor_sus([5, 1, 5, 1, 5, 1, 5, 1, 5, 1]), "(harus 100)")
    print(skor_leppink([2, 2, 2, 1, 1, 1, 9, 9, 9, 9]))
