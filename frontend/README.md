# 📌 Aplikasi Absensi Siswa Berbasis QR Code

Aplikasi absensi siswa berbasis **QR Code** dengan dukungan:  
- **Guru/Admin (Web/Mobile)** → kelola absensi & laporan  
- **Siswa (Web/Mobile)** → absensi lewat scan QR & lihat riwayat  

---

## 🚀 Fitur Aplikasi

### 🔹 Fitur

✅ **Guru/Admin**
- Generate QR Code harian untuk absensi.  
- Lihat daftar siswa yang sudah/belum hadir.  
- Laporan absensi sederhana (JSON/tabel di web).  

✅ **Siswa**
- Login menggunakan username dan password.  
- Scan QR Code untuk absensi (via kamera HP/webcam).  
- Mendapatkan status absensi berhasil/gagal.  
- Melihat status absensi hari ini (Hadir, Terlambat, Izin, Sakit, Alpa).  

✅ **Sistem**
- Validasi QR Code (token unik + expired time).  
- Simpan data absensi ke database (user_id, kelas, waktu).  

---

## 🌐 Fitur Guru/Admin

1. **Login & Autentikasi** → akses sesuai role.  
2. **Generate QR Code** → QR unik dengan expired time.  
3. **Dashboard Absensi** → daftar hadir/izin/sakit/alpa + filter kelas.  
4. **Manajemen Data** → CRUD siswa, guru, kelas, jadwal.  
5. **Notifikasi Otomatis** → WA/email ke siswa/orangtua.  
6. **Log Aktivitas** → catat login, generate QR, export laporan.  

---

## 👨‍🎓 Fitur Siswa (Web & Mobile)

1. **Login & Autentikasi** → username dan password.  
2. **Scan QR Code** → via kamera HP atau webcam laptop.  
3. **Status Kehadiran** → hasil absensi langsung muncul.  
4. **Riwayat Absensi** → histori absensi.  
5. **Notifikasi** → popup/web push/mobile push untuk keterlambatan/ketidakhadiran.  