# Book Manager Frontend

React + TypeScript + TailwindCSS frontend untuk Book Manager API.

## Prerequisites

1. Node.js (versi 18 atau lebih tinggi)
2. npm atau yarn
3. Practice-nest API harus berjalan di http://localhost:3000

## Installation & Setup

1. Install dependencies:

```bash
npm install react-router-dom axios
npm install --save-dev @types/node
```

2. Start development server:

```bash
npm run dev
```

3. Pastikan Practice-nest API berjalan di http://localhost:3000

## Features

### Authentication

- User registration
- User login
- JWT token management
- Auto redirect saat token expired

### Book Management

- Browse semua buku (requires login)
- View buku milik user
- Create buku baru
- Edit buku milik user
- Delete buku milik user
- Upload gambar buku (URL)

### UI/UX

- Responsive design dengan TailwindCSS
- Loading states
- Error handling
- Protected routes
- Navigation dengan user info

## API Endpoints

Frontend ini mengintegrasikan dengan endpoints berikut:

### Auth

- POST /auth/register
- POST /auth/login
- GET /auth/profile

### Books

- GET /books (semua buku)
- GET /books/my-books (buku user)
- GET /books/:id
- POST /books
- PATCH /books/:id
- DELETE /books/:id

## File Structure

```
src/
├── components/
│   ├── Navigation.tsx        # Top navigation bar
│   ├── ProtectedRoute.tsx    # Route protection wrapper
│   └── BookCard.tsx          # Book display component
├── pages/
│   ├── HomePage.tsx          # Landing page
│   ├── LoginPage.tsx         # Login form
│   ├── RegisterPage.tsx      # Registration form
│   ├── BooksPage.tsx         # All books listing
│   ├── MyBooksPage.tsx       # User's books with CRUD
│   └── BookFormPage.tsx      # Add/Edit book form
├── context/
│   └── AuthContext.tsx       # Authentication state management
├── services/
│   └── api.ts               # HTTP client & API calls
├── types/
│   └── index.ts             # TypeScript interfaces
└── App.tsx                  # Main app with routing
```

## Development

1. Start backend: `cd practice-nest && npm run start:dev`
2. Start frontend: `cd fe-practice-nest && npm run dev`
3. Open http://localhost:5173

## Usage

1. Buka aplikasi di browser
2. Register atau login dengan akun
3. Browse semua buku di "/books"
4. Manage buku pribadi di "/my-books"
5. Add buku baru di "/books/new"
6. Edit/delete buku yang sudah dibuat

## Notes

- Semua operasi buku memerlukan autentikasi
- User hanya bisa edit/delete buku yang mereka buat
- Token disimpan di localStorage
- Auto redirect ke login jika token expired
