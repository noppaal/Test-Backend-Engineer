# Simple Blog REST API with JWT Authentication

REST API sederhana untuk mengelola postingan blog yang dilengkapi dengan sistem autentikasi pengguna menggunakan JSON Web Token (JWT). Proyek ini dibangun sebagai bagian dari Tes Node.js Backend Engineer.

---

## 🚀 Fitur Utama

- **Autentikasi Pengguna**: Registrasi akun baru dan login menggunakan JWT.
- **Manajemen Postingan**: Operasi CRUD (Create, Read, Update, Delete) postingan blog.
- **Keamanan Hak Akses**: 
  - Postingan dapat dilihat oleh publik (tanpa login).
  - Pembuatan postingan memerlukan autentikasi login.
  - Pembaruan (*update*) dan penghapusan (*delete*) postingan hanya dapat dilakukan oleh pemilik/penulis asli dari postingan tersebut.
- **Pengujian Unit & Integrasi**: Dilengkapi dengan 13 skenario tes komprehensif menggunakan Jest dan Supertest.
- **Database Dinamis**: Otomatis mendeteksi lingkungan pengujian (menggunakan SQLite in-memory) dan lingkungan pengembangan (menggunakan MySQL).

---

## 🛠️ Teknologi yang Digunakan

- **Runtime**: Node.js (v24.x)
- **Web Framework**: Express.js
- **ORM**: Sequelize
- **Database Driver**: MySQL2 (dengan SQLite3 untuk pengujian)
- **Autentikasi**: JSON Web Token (JWT) & BcryptJS (untuk enkripsi password)
- **Pengujian**: Jest & Supertest

---

## 📄 Berkas Lampiran (PDF)

Anda dapat melampirkan berkas dokumen PDF terkait tes ini (seperti soal ujian, instruksi, atau CV Anda) di proyek ini.
- Silakan letakkan berkas PDF Anda di direktori utama (*root*) proyek ini.
- Ubah nama berkas PDF tersebut menjadi `soal-test.pdf`.
- Anda dapat mengunduh atau mengakses dokumen tersebut melalui tautan berikut:
  👉 **[Unduh Dokumen Soal Ujian (PDF)](./soal-test.pdf)**

---

## ⚙️ Persyaratan Sistem & Instalasi

### 1. Kloning Repositori
```bash
git clone https://github.com/noppaal/Test-Backend-Engineer.git
cd Test-Backend-Engineer
```

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal seluruh pustaka yang diperlukan:
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
Buat berkas bernama `.env` pada folder utama proyek dan sesuaikan konfigurasi database MySQL lokal Anda:
```ini
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=test_backend_engineer
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```
*Catatan: Aplikasi akan secara otomatis mendeteksi jika database `test_backend_engineer` belum ada di MySQL Anda, lalu membuatnya secara otomatis saat server dijalankan pertama kali.*

---

## 💻 Cara Menjalankan Aplikasi

Pastikan layanan MySQL lokal Anda (seperti XAMPP MySQL) sudah aktif, kemudian jalankan perintah:
```bash
npm start
```
Server akan berjalan secara lokal di port `3000` (atau sesuai konfigurasi `.env`).

---

## 🧪 Cara Menjalankan Pengujian (*Unit Testing*)

Proyek ini telah dilengkapi dengan unit test otomatis. Pengujian dijalankan secara terisolasi menggunakan SQLite in-memory database sehingga tidak akan memengaruhi data pada database MySQL Anda.

Jalankan perintah:
```bash
npm test
```

---

## 📋 Daftar API Endpoints

### 🔑 Autentikasi Pengguna
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/users/register` | Publik | Registrasi akun pengguna baru (nama, email, password) |
| **POST** | `/api/users/login` | Publik | Login pengguna, mengembalikan JWT token |

### 📝 Postingan Blog
| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/posts` | Publik | Mengambil semua postingan blog beserta info penulisnya |
| **GET** | `/api/posts/:id` | Publik | Mengambil postingan blog berdasarkan ID |
| **POST** | `/api/posts` | Terautentikasi (JWT) | Membuat postingan blog baru |
| **PUT** | `/api/posts/:id` | Terautentikasi (Pemilik) | Mengubah konten postingan berdasarkan ID |
| **DELETE** | `/api/posts/:id` | Terautentikasi (Pemilik) | Menghapus postingan berdasarkan ID |

---

## 🧪 Pengujian Menggunakan Postman

Anda dapat mengimpor berkas pengujian API Postman yang sudah saya sediakan di dalam repositori:
* 📁 **[Blog_API_Postman_Collection.json](./Blog_API_Postman_Collection.json)**

Koleksi Postman ini memiliki konfigurasi otomatis sehingga:
1. Setelah login berhasil, token JWT otomatis disimpan dan dilampirkan pada permintaan berikutnya.
2. Setelah membuat postingan, ID postingan tersebut otomatis tersimpan untuk pengujian GET/PUT/DELETE.
