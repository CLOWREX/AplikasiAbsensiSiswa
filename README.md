🔹 1. Fitur Dasar

✅ Guru/Admin

Generate QR Code harian untuk absensi.

Lihat daftar siswa yang sudah/ belum hadir.

Laporan absensi sederhana (misalnya JSON/ tabel di web).

✅ Siswa

Scan QR Code untuk melakukan absensi.

Mendapatkan status absensi berhasil/gagal.

✅ Sistem

Validasi QR Code (punya token unik + expired time).

Simpan data absensi ke database (user_id, kelas, waktu).

🔹 2. Fitur Lanjutan

✅ Guru/Admin

Export laporan ke Excel/CSV.

Filter absensi per kelas, tanggal, atau siswa.

Bisa melihat statistik (grafik kehadiran).

✅ Siswa

Bisa login (pakai username/password atau NISN).

Riwayat absensi pribadi.

✅ Sistem

Role-based access (guru, siswa, admin).

Notifikasi keterlambatan (via WhatsApp/Email).

API terproteksi dengan JWT (supaya aman).

🔹 3. Fitur Advanced

✨ Integrasi Lanjutan

Integrasi dengan sistem akademik/sekolah (nilai, jadwal, dll).

QR Code bisa diganti jadi NFC/RFID kalau sekolah punya alat.

✨ Frontend Modern

Dashboard guru dengan grafik interaktif (pakai Chart.js / Recharts).

Dark mode / light mode.

Mobile responsive (bisa diakses dari HP siswa).

✨ Keamanan

Semua secret key disimpan di .env (tidak di-push ke GitHub).

Hashing password (pakai bcrypt).

Rate limiting untuk API biar aman dari brute force.
