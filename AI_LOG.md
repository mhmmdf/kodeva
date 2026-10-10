# AI_LOG — log penggunaan AI

Tes ini saya kerjakan dengan bantuan beberapa AI: brainstorming & perencanaan di **Claude**, coding utuh di **opencode** (CLI agen coding), dan aset gambar di **ChatGPT**. Catatannya meliputi tools yang dipakai, prompt yang paling membantu, kejadian saat AI memberi hasil yang salah, bagian yang dibantu AI beserta edge case yang diuji, serta bagian yang saya kerjakan sendiri.

## Tools yang dipakai

| Tool | Untuk bagian mana |
|---|---|
| **Claude** | Brainstorming & perencanaan sebelum coding: diskusi arsitektur, pemilihan stack, urutan pengerjaan, dan menyusun prioritas requirement |
| **opencode + model bahasa** | Kerja utuh seluruh step: scaffolding proyek, menulis fitur landing/blog/marketplace/CMS/tracking, menulis dan menjalankan test e2e, membantu diagnosa bug |
| **ChatGPT** | Aset gambar: screenshot fitur produk (SVG), cover artikel blog, dan ilustrasi hero landing |
| **Playwright (chromium headless)** | Test e2e tiap step: login admin, CRUD artikel/landing/leads, tracking event, responsivitas mobile — 27 skenario, saat itu semua hijau |
| **Lighthouse CLI** | Mengukur skor Lighthouse mobile untuk landing, hasilnya di-screenshot ke README |
| **pdftotext** | Membaca brief PDF `Fullstack_Developer_Skill_Test_DSG.pdf` |
| **Git + PR** | Saya yang menulis pesan commit, menjalankan `git add`/`commit`/`push`, dan merge PR — AI hanya menyiapkan diff |

Catatan soal test: file test e2e-nya hanya dipakai untuk verifikasi internal saat pengembangan dan tidak ikut di-commit, karena brief memang tidak mewajibkan test otomatis. Deliverable tetap kode aplikasi + README + log ini.

## Prompt yang paling membantu

1. **Batasan kerja per step** — *"Kerjakan per step kecil di main, saya review dulu sebelum push; AI jangan commit/push."*
   Diff jadi kecil dan teruji tiap PR, dan saya selalu memegang kendali. Ini paling berpengaruh pada kualitas hasil.

2. **Konsistensi aturan bahasa dan naming** — *"Docstring dan komentar di codebase pakai bahasa Inggris; teks UI tetap Indonesia; route URL pakai English (`/products`, `/cart`, `/admin/posts`)."*
   Diterapkan konsisten di semua file sehingga tidak ada campur aduk penamaan.

3. **Bug spesifik dari pengamatan manual** — *"Perbaiki bug di UI admin: font input putih saat mode gelap."*
   Bug ini tidak ditemukan test otomatis, tapi prompt singkat memicu perbaikan yang menyeluruh (lihat contoh salah nomor 1).

## Contoh output AI yang salah

### 1. Input form admin berwarna putih saat dark mode

- **Masalah:** komponen CMS disalin tanpa warna teks yang eksplisit sehingga mengikuti `--foreground` terang bawaan Next saat sistem dark mode → teks putih di atas kartu putih, tidak terbaca.
- **Ditemukan oleh:** review manual saya sendiri setelah login pertama — bukan dari lint/typecheck/e2e.
- **Diperbaiki:** menambahkan `bg-white text-slate-900 placeholder:text-slate-400` di input teks admin. Ternyata kejadian berulang di form artikel, lalu saya pasang **guard global** di `app/globals.css` (input/textarea/select kecuali checkbox/radio) agar tidak terulang lagi.
- **Diverifikasi:** test Playwright dengan `colorScheme: "dark"` — semua `input[type=text]`/`textarea`/`select` menghitung `color: rgb(15, 23, 42)`.

### 2. Helper dipanggil dari server tapi didefinisikan di file client → build gagal

- **Masalah:** fungsi `buildViewEcommerce` diekspor dari komponen ber-`"use client"` lalu dipanggil dari server component → `npm run build` error ("can't call client function from the server").
- **Ditemukan oleh:** `npm run build` pada iterasi pertama step tracking.
- **Diperbaiki:** fungsi dipindah ke `lib/tracking/dataLayer.ts` (modul bersih tanpa directive), komponen client tinggal memakainya.
- **Diverifikasi:** build hijau dan event `view_item` tetap terkirim di e2e.

### 3. Test e2e menekan tombol yang salah

- **Masalah:** `page.click('button[type="submit"]')` malah menekan tombol **"Keluar"** di header (elemen pertama di DOM), sehingga alur login terlihat gagal redirect ke `/admin/login`.
- **Ditemukan oleh:** kegagalan e2e yang membingungkan saat step 7b.
- **Diperbaiki:** selector di-scope ke dalam form tujuan (`form:has(...)`), dan test e2e dibaca ulang satu per satu untuk menemukan asumsi semacam ini.
- **Diverifikasi:** skenario login ulang hijau.

## Sesi deploy ke Vercel (10 Oktober 2026)

Bagian deploy ke Vercel dikerjakan bersama **opencode** di akhir pengerjaan — bukan karena output AI yang salah, melainkan diagnosa masalah lingkungan produksi yang belum pernah dijalani sebelumnya:

- **Masalah 1:** build Vercel gagal di `collecting page data` dengan error `relation "posts" does not exist` (Neon, kode `42P01`). Lokal lancar karena `DATABASE_URL` kosong → memakai PGlite yang sudah termigrasi.
- **Diagnosis:** migrasi Drizzle selama ini hanya dijalankan ke PGlite lokal; Neon dari integrasi Vercel Marketplace masih kosong. AI memeriksa `scripts/migrate.ts`, driver `neon-http`, dan log build untuk memastikan akar masalahnya sebelum menyentuh kode.
- **Perbaikan:** `npm run db:setup` dijalankan sekali terhadap database Neon production (migrasi + seed), lalu script `prebuild: npm run db:migrate` ditambahkan ke `package.json` supaya schema selalu up-to-date tiap build tanpa migrasi manual. Verifikasi: query hitung row langsung ke Neon (6 artikel, 5 published) plus `npm run build` lokal hijau.
- **Masalah 2:** build branch preview gagal dengan error berbeda — `generateStaticParams` harus return minimal satu slug (aturan Cache Components di Next 16). Ternyata `DATABASE_URL` belum ter-set di environment Preview, jadi build jatuh diam-diam ke PGlite kosong.
- **Perbaikan:** `DATABASE_URL` ditambahkan ke environment Preview, plus `SESSION_SECRET` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` untuk login CMS di produksi. Redeploy → hijau, login dan edit CMS dari browser production dicek manual dan berfungsi.
- **Pelajaran:** fallback PGlite di `lib/db/client.ts` memang praktis untuk lokal, tapi menyembunyikan kesalahan env var di produksi (build "sukses" memakai DB lewat-tempo yang hilang). Rencana perbaikan: fail-fast dengan pesan jelas kalau `DATABASE_URL` kosong saat berjalan di Vercel.

## Bagian yang banyak dibantu AI + edge case yang diuji

Bagian yang paling banyak dibantu AI adalah **form lead capture** (Bagian A, wajib), yang divalidasi dan disempurnakan lewat beberapa kali review:

- validasi Zod di server (wajib isi, email valid, panjang maksimal),
- **honeypot** field `website` — jika terisi, submit dibuang diam-diam,
- **time-trap** — submit lebih cepat dari 3 detik dianggap bot,
- **rate-limit** in-process — maksimal 3 percobaan per IP+email tiap 10 menit,
- pesan error per field, plus keadaan kosong/belum ada lead.

Edge case yang **terbukti lewat e2e**:

- submit biasa → data + UTM masuk DB dan tampil di `/admin/leads`
- slug duplikat saat menyimpan artikel → ditolak dengan pesan, data asli tidak hilang
- artikel `draft` → muncul di admin, tetapi **tidak** tampil di `/blog` dan `/blog/[slug]`
- tamu membuka `/admin` → redirect ke `/admin/login`
- `view_item` terkirim tepat 1× walaupun komponen re-render (tidak dobel)
- badge jumlah keranjang tampil benar tanpa hydration mismatch (SSR 0 → client 1)
- mobile 375px — halaman `/`, `/products`, `/blog`, `/cart` tidak menembus horizontal (setelah perbaikan navbar)
- batas kuota lintas paket: Basic 12 lalu Pro di produk yang sama → sisa kuota 0, tombol tambah mati; storage keranjang yang dimanipulasi pun di-clamp ulang saat dibaca
- simulasi pembayaran gagal → keranjang tetap tersimpan dan ringkasan tampil di `/cart/failed`; sukses → ringkasan tampil di `/cart/success` dan keranjang dikosongkan

Sedangkan honeypot, time-trap, dan rate-limit **saya cek lewat membaca kode**: komponennya sudah terpasang di server action, tapi belum dieksekusi otomatis. Ini masuk daftar rencana bila diberi waktu 1 minggu lagi.

## Bagian yang saya kerjakan sendiri tanpa AI

- **Brainstorming awal di Claude** — diskusi arsitektur & prioritas sebelum baris kode pertama: menentukan stack, route structure, dan urutan pengerjaan step.
- **Aset gambar via ChatGPT** — semua screenshot produk (SVG), cover artikel blog, dan ilustrasi hero landing page dihasilkan dari ChatGPT, bukan dari opencode.
- **Semua commit & pesan commit** — saya yang menulis pesan commit, menjalankan `git add`, `git commit`, `git push`, dan merge PR. AI hanya menyiapkan diff.
- **Alur kerja dan proses review** — keputusan memecah branch per step, urutan pengerjaan, kapan merge, dan review manual di tiap PR. Ini bagian yang paling menentukan kualitas akhir.
- **Dua testing manual di browser** yang menemukan bug nyata: input admin putih di dark mode (contoh salah nomor 1) dan navbar mobile yang menembus viewport (step 9). Keduanya **tidak ditemukan** oleh e2e/Lighthouse otomatis.
- **Penamaan dan prioritas** — konvensi route memakai English, serta menentukan requirement wajib mana yang dikerjakan lebih dulu.
- **Konten seed** — teks campaign, artikel blog, testimoni, FAQ, dan nama produk (ditulis langsung, bukan output model).
- **Final QA sendiri** — review manual setelah build menemukan dua masalah yang tidak tertangkap otomatis: (a) angka rate-limit di AI_LOG ini tadinya salah (5/5 menit, seharusnya 3/10 menit — saya cek langsung ke `app/actions/leads.ts`), dan (b) README men claim fitur yang belum ada di kode (batas kuota lintas paket & simulasi pembayaran gagal). Keduanya saya perbaiki sendiri sebelum finalisasi.
