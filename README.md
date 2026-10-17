# ByteBucket

ByteBucket adalah layanan Image CDN & Storage berbasis Express.js, Prisma, MySQL, Sharp, dan Astro.js.

## Fitur

- Register, login, dan JWT authentication.
- API key management dengan hash bcrypt.
- Upload hingga 10 gambar melalui `X-API-Key`.
- Konversi otomatis JPG/PNG ke WebP menggunakan Sharp.
- CDN serving dengan cache header satu tahun.
- Gallery dashboard dengan CDN URL dan tombol copy.
- Dokumentasi integrasi JavaScript, cURL, dan Python.

## Struktur proyek

```text
bytebucket/
├── backend/       # Express + TypeScript + Prisma
│   ├── prisma/
│   ├── src/routes/
│   ├── src/middlewares/
│   └── uploads/   # lokal, tidak di-commit
└── frontend/      # Astro UI
    └── src/pages/
```

## Menjalankan backend

```powershell
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Backend berjalan di `http://localhost:4000`.

## Menjalankan frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend berjalan di `http://localhost:4321`.

Set `PUBLIC_API_URL` pada `frontend/.env` ke URL backend.

## API utama

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | JWT |
| POST | `/api/keys/generate` | JWT |
| GET | `/api/keys` | JWT |
| DELETE | `/api/keys/:id` | JWT |
| POST | `/api/v1/upload` | `X-API-Key` |
| GET | `/api/images` | JWT |
| GET | `/cdn/:filename` | Public |

### Upload gambar

```bash
curl -X POST http://localhost:4000/api/v1/upload \
  -H "X-API-Key: sk_live_your_key" \
  -F "images=@photo.png"
```

Field upload adalah `images`, maksimal 10 file per request, dengan batas 25 MB per file.

## Keamanan repository

File `.env`, database lokal, dependency, build output, cache, dan gambar upload lokal dikecualikan melalui `.gitignore`. Jangan pernah commit JWT secret, database password, API key lengkap, atau file upload pengguna.

## License

Private project — ByteBucket.
