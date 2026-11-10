# NÉSTAY — Website booking khách sạn 

Mở URL Vite in ra, chạy `npm run dev -- --port 3000`, rồi mở `http://localhost:3000`.

```bash
npm run build
npm run preview
```

## Các trang và chức năng

| URL | Nội dung |
| --- | --- |
| `/` | Trang chủ, tìm kiếm và giới thiệu nơi lưu trú nổi bật |
| `/rooms` | Danh sách, lọc theo điểm đến / số khách / loại lưu trú, sắp xếp giá hoặc đánh giá |
| `/rooms/:slug` | Chi tiết phòng, tiện nghi, chọn ngày và gửi yêu cầu đặt phòng |
| `/about-us` | Giới thiệu đồ án NÉSTAY |
| `/contact` | Biểu mẫu liên hệ mô phỏng |
| `/bookings` | Xem và xóa yêu cầu được lưu trên trình duyệt |
| URL khác | Trang 404 |


## Cấu trúc

```text
hotel-booking/
├── index.html             # HTML gốc, thẻ #root và metadata
├── src/
│   ├── main.jsx           # Khởi tạo React và BrowserRouter
│   ├── App.jsx            # Layout, các trang, Route, component và tương tác
│   ├── styles.css         # CSS responsive cho toàn website
│   └── data/hotels.js     # Dữ liệu minh họa, giá và địa điểm
├── package.json
└── vite.config.js
```
