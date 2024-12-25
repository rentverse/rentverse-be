# RentVerse

## Deskripsi

**RentVerse** adalah aplikasi sewa barang yang memungkinkan pengguna untuk menyewa berbagai jenis barang dengan mudah dan cepat. Aplikasi ini dirancang untuk memberikan pengalaman pengguna yang intuitif, memungkinkan penyewa dan pemilik barang untuk terhubung dengan efisien. Dengan RentVerse, Anda dapat menemukan barang yang Anda butuhkan, melakukan transaksi sewa, dan mengelola penyewaan Anda dengan mudah.

## Tutorial Setup

### 1. Clone Repo

Clone repository dari branch `main`:

```bash
git clone -b main <repository-url>
```

### 2. Install Package

Setelah meng-clone repo, instal semua package yang diperlukan dengan perintah:

```bash
npm install
```

### 3. Migrasi Database

- Buat file `.env.development.local` dan `.env.production.local`, kemudian isikan dengan variabel berikut:

```env
DB_HOST=<your_db_host>
DB_PORT=<your_db_port>
DB_NAME=<your_db_name>
DB_USERNAME=<your_db_username>
DB_PASSWORD=<your_db_password>
```

- Jalankan migrasi database dengan perintah berikut:

  - Untuk development:

    ```dev
    npm run dev:migrate:up
    ```

  - Untuk production:

    ```bash
    npm run migrate:up
    ```

- Jangan lupa untuk menjalankan seeder juga:
  - Untuk development:

    ```bash
    npm run dev:seed:up
    ```

  - Untuk production:

    ```bash
    npm run seed:up
    ```

### 4. Jalankan Mode Development

- **Untuk Guest**:

  - Buat file `.env.development.local`, isi dengan daftar variabel environment seperti pada file `.env.example`. Lalu jalankan:

    ```bash
    npm run local:dev
    ```

- **Untuk Tim RentVerse**:
  - Buat file `.env.development.local`, isi dengan:

    ```env
    INFISICAL_CLIENT_ID=<your_client_id>
    INFISICAL_CLIENT_SECRET=<your_client_secret>
    PORT=<your_port>
    ```

  - Lalu jalankan:

    ```bash
    npm run local:dev
    ```

### 5. Jalankan Mode Production

- **Untuk Guest**:

  - Buat file `.env.production.local`, isi dengan daftar variabel environment seperti pada file `.env.example`. Lalu jalankan:

    ```bash
    npm run local:prod
    ```

- **Untuk Tim RentVerse**:
  - Buat file `.env.production.local`, isi dengan:

    ```env
    INFISICAL_CLIENT_ID=<your_client_id>
    INFISICAL_CLIENT_SECRET=<your_client_secret>
    PORT=<your_port>
    ```

  - Lalu jalankan:

    ```bash
    npm run local:prod
    ```

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan buat pull request atau buka issue untuk diskusi lebih lanjut.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
