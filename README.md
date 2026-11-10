# ✳️ NÉSTAY — Website Đặt Phòng Khách Sạn & Nghỉ Dưỡng

> *"Stay a little longer — Thêm một chút bình yên vào mỗi hành trình."*

---

## 🛠️ Công Nghệ Sử Dụng

| Công nghệ | Phiên bản | Mục đích sử dụng |
| :--- | :--- | :--- |
| **React** | `^19.2` | Thư viện xây dựng giao diện người dùng (UI components) |
| **Vite** | `^8.3` | Build tool và môi trường phát triển siêu nhanh |
| **React Router** | `^8.5` | Điều hướng SPA (Single Page Application) |
| **Lucide React** | `^1.71` | Bộ icon vector hiện đại, tối giản |
| **CSS3** | Modern CSS | CSS Variables, Flexbox/Grid, Responsive Mobile-First |
| **Web Storage API** | `localStorage` | Lưu trữ dữ liệu đơn đặt phòng tại client |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu môi trường
- **Node.js**: Phiên bản `20.19+` hoặc `22.12+` (khuyến nghị Node.js `22.x`)
- **Trình quản lý gói**: `npm` (đi kèm Node.js) hoặc `yarn` / `pnpm`

### Các bước thực hiện

1. **Di chuyển vào thư mục dự án**:
   ```bash
   cd hotel-booking
   ```

2. **Cài đặt các thư viện phụ thuộc**:
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Dev server)**:
   ```bash
   npm run dev
   ```
   > Hoặc chạy cố định trên cổng 3000:
   ```bash
   npm run dev -- --port 3000
   ```
   Sau đó mở trình duyệt và truy cập: `http://localhost:3000` (hoặc cổng hiển thị trên terminal).

4. **Đóng gói dự án (Production Build)**:
   ```bash
   npm run build
   ```

5. **Xem thử bản build (Preview)**:
   ```bash
   npm run preview
   ```

---

## 🧭 Cấu Trúc Điều Hướng (Sitemap)

| Đường dẫn (URL) | Trang | Chức năng chính |
| :--- | :--- | :--- |
| `/` | **Trang chủ** | Giới thiệu điểm đến hot, các chỗ nghỉ nổi bật, thanh tìm kiếm nhanh |
| `/rooms` | **Khám phá** | Danh sách phòng, lọc theo điểm đến/loại phòng/số khách, sắp xếp theo giá |
| `/rooms/:slug` | **Chi tiết phòng** | Xem ảnh gallery, tiện nghi, nhập thông tin và gửi yêu cầu đặt phòng |
| `/bookings` | **Đơn đặt phòng** | Xem và quản lý các đơn đặt phòng đã lưu trên trình duyệt |
| `/about-us` | **Về chúng tôi** | Giới thiệu dự án, thông điệp và giá trị cốt lõi của NÉSTAY |
| `/contact` | **Liên hệ** | Biểu mẫu phản hồi và gửi liên hệ mô phỏng |
| `*` | **404 Not Found** | Xử lý các đường dẫn không tồn tại, có nút quay về trang chủ |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
hotel-booking/
├── src/
│   ├── data/
│   │   └── hotels.js       # Mock data danh sách khách sạn, giá, địa điểm & tiện nghi
│   ├── App.jsx             # Toàn bộ layout, định tuyến (Routes) và component trang
│   ├── main.jsx            # Entry point khởi tạo React DOM và BrowserRouter
│   └── styles.css          # Toàn bộ stylesheet (Typography, Layout, Responsive)
├── index.html              # Template HTML gốc (#root)
├── package.json            # Cấu hình dự án, scripts & dependencies
├── vite.config.js          # Cấu hình Vite & plugin React
└── README.md               # Tài liệu hướng dẫn dự án
```
