# 📌 Aplikasi Absensi Siswa Berbasis QR Code

Aplikasi absensi siswa modern berbasis **QR Code** dengan dukungan:  
- **Guru/Admin (Web App)** → kelola absensi & laporan  
- **Siswa (Web/Mobile)** → absensi lewat scan QR & lihat riwayat  

Dilengkapi fitur notifikasi otomatis (WhatsApp/Email) serta laporan absensi yang bisa diexport ke Excel/PDF.  

---

## 🚀 Fitur Aplikasi

## ⚙️ Backend (Server/Database)

1. **Autentikasi & Authorization** → login + role (Admin/Guru/Siswa).  
2. **Manajemen Data (CRUD API)** → siswa, guru, kelas, jadwal.  
3. **Generate QR Code Session** → token unik dengan masa berlaku.  
4. **Absensi (Scan Handler)** → simpan data saat scan QR.  
5. **Validasi Absensi** → cek QR aktif & hindari double scan.  
6. **Laporan & Statistik** → total hadir, izin, sakit, alpa.  
7. **Export Data** → hasil laporan Excel/PDF.  
8. **Notifikasi Otomatis** → WA/email jika terlambat/absen.  
9. **Keamanan & Log Aktivitas** → bcrypt, JWT, rate limiting, audit log, validation.  

---

## 🏗️ Alur Sistem

1. Guru login di web → generate QR Code.  
2. QR Code ditampilkan di kelas.  
3. Siswa login via **web/mobile** → scan QR Code.  
4. Backend validasi & simpan ke database.  
5. Jika terlambat/tidak hadir → notifikasi otomatis terkirim.  
6. Guru cek laporan di dashboard → bisa export Excel/PDF.  

---

## 🛠️ Teknologi yang Direkomendasikan   

- **Frontend Web (Guru/Admin & Siswa):** React.js / Vue.js  
- **Frontend Mobile (Siswa):** Flutter / React Native  
- **Backend:** Laravel / Node.js (Express)  
- **Database:** MySQL / PostgreSQL  
- **QR Code Generator:** Simple-QrCode (Laravel) / qrcode (Node.js)  
- **Notifikasi:** WhatsApp Cloud API, SMTP (Email)  
- **Export Excel/PDF:** PhpSpreadsheet (PHP) / SheetJS (JS)  

---

## 📊 Struktur Database (Simplifikasi)

- **users** → data login (role: admin, guru, siswa)  
- **students** → data siswa (NIS, nama, kelas, kontak, email)  
- **classes** → data kelas  
- **attendance** → absensi harian (id_siswa, tanggal, status, jam_masuk)  
- **qrcode_sessions** → token unik QR Code (id, token, expired_at)  