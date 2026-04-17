# VinSport Backend

Backend Express tối thiểu để chạy với frontend VinSport của bạn.

## 1) Cài package
```bash
npm install
```

## 2) Tạo file `.env`
Tạo file `.env` trong thư mục backend:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## 3) Chạy backend
```bash
npm run dev
```

## 4) Frontend `.env`
Ở frontend sửa lại:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK=false
```

## 5) Tài khoản test
- email: `demo@vinsport.vn`
- password: `123456`

hoặc

- email: `a@gmail.com`
- password: `123456`

## 6) API có sẵn
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/login`
- `POST /api/orders`
- `GET /api/orders`

## 7) Test nhanh
Mở trình duyệt:
- `http://localhost:5000/api/products`
- `http://localhost:5000/api/products/g-n1`

Nếu ra JSON là backend ổn.
