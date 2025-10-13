-- Buat database (jalankan di pgAdmin sebelum import schema)
-- CREATE DATABASE absensi_qr;

-- Pilih database
-- \c absensi_qr;

-- Tabel untuk pengguna (guru dan siswa)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('guru', 'siswa')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel absensi
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_in TIME,
    status VARCHAR(20) CHECK (status IN ('hadir', 'izin', 'alpha')),
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Opsional) Tabel kelas
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Tambahkan data awal (contoh)
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'guru'),
('guru1', 'guru123', 'guru'),
('siswa1', 'siswa123', 'siswa');
