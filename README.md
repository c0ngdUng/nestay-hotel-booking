# NÉSTAY — Website booking khách sạn (đồ án React)

Project mẫu cho bài tập ReactJS: giao diện website đặt phòng khách sạn bằng **Vite + React + React Router**. Dữ liệu khách sạn, giá và đánh giá là dữ liệu minh họa. Chức năng đặt phòng chỉ lưu yêu cầu trong `localStorage` của trình duyệt; không kiểm tra tình trạng phòng, gửi email hay thanh toán.

## Chạy project

Yêu cầu Node.js 20.19+ hoặc 22.12+; nên dùng Node.js 22 trở lên.

```bash
npm install
npm run dev
```

Mở URL Vite in ra, mặc định là `http://localhost:5173`. Nếu bài tập yêu cầu cổng 3000, chạy `npm run dev -- --port 3000`, rồi mở `http://localhost:3000`.

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

Ví dụ truy cập trực tiếp: `http://localhost:5173/about-us` và `http://localhost:5173/rooms/the-slow-da-nang`. Vite dev server và `vite preview` trả `index.html` cho các đường dẫn ứng dụng để `BrowserRouter` hiển thị đúng trang. Nếu triển khai lên hosting tĩnh khác, cần cấu hình fallback mọi URL về `index.html`.

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

React Router được dùng với `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `useNavigate`, `useParams` và `useSearchParams`. Thẻ `NavLink` hiển thị menu đang chọn; form tìm kiếm truyền bộ lọc qua query string. Người dùng có thể nhấn menu hoặc nhập URL trực tiếp.

## Đối chiếu yêu cầu bài tập

1. Dự án dùng ReactJS với Vite.
2. `index.html` cung cấp HTML gốc; JSX trong `App.jsx` tạo trang chủ theo đề tài booking khách sạn.
3. `src/styles.css` định dạng giao diện và responsive.
4. Source code đã được đẩy lên repository công khai [c0ngdUng/nestay-hotel-booking](https://github.com/c0ngdUng/nestay-hotel-booking).
5. Có thêm các trang khám phá, chi tiết, giới thiệu, liên hệ, yêu cầu đặt phòng và 404; `HotelCard`, `SearchForm`, `Header`, `Footer` là component dùng lại.
6. Đã tích hợp React Router.
7. Menu chuyển trang và đường dẫn trực tiếp hoạt động với Vite.

## Repository GitHub

Link nộp bài: **https://github.com/c0ngdUng/nestay-hotel-booking**.

Để tải source và làm việc tiếp:

```bash
git clone https://github.com/c0ngdUng/nestay-hotel-booking.git
cd nestay-hotel-booking
npm install
npm run dev
```

Khi nhóm chỉnh sửa project, dùng `git add .`, `git commit -m "Mô tả thay đổi"` và `git push` từ tài khoản có quyền ghi vào repository.

## Ghi chú

- Ảnh minh họa tải từ Unsplash, font tải từ Google Fonts; cần mạng để hiện ảnh và font. Nếu không có mạng, bố cục vẫn hiển thị với màu nền và font dự phòng.
- Dữ liệu trong `localStorage` chỉ có trên đúng trình duyệt và thiết bị đã nhập; xóa dữ liệu duyệt web sẽ xóa yêu cầu.
- Không nhập thông tin cá nhân thật khi trình bày bản demo.
