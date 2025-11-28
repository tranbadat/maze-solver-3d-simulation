# MeCung-AStar — 3D Giải mê cung & Trực quan hóa (Tiếng Việt)

Trực quan hóa tương tác các thuật toán tìm đường (A* và BFS) sử dụng React, Next.js và react-three/fiber.

Dự án biểu diễn hoạt động của các thuật toán trên mê cung được tạo ngẫu nhiên hoặc do người dùng cung cấp, đồng thời trực quan hóa trạng thái từng bước (open set, closed set) cả ở giao diện 3D và UI, cùng so sánh hiệu năng giữa A* (có heuristic) và BFS.

---

## Tính năng

- Trực quan mê cung trong 3D với điều khiển camera tương tác (OrbitControls)
- Triển khai A* với log chi tiết và chức năng xem từng bước
- Triển khai BFS để so sánh hiệu năng
- So sánh thuật toán song song: chiều dài đường đi, ô được thăm, thời gian chạy
- Preset và tạo mê cung ngẫu nhiên; tuỳ chỉnh kích thước lưới
- Điều khiển phát/tạm dừng từng bước và điều chỉnh tốc độ
- Bảng log và tóm tắt kết quả
- Hỗ trợ font tiếng Việt (Noto Sans)

---

## Demo / Ảnh chụp màn hình

 ![alt](/demo/demo.png)

---

## Công nghệ

- Next.js (App Router)
- React
- TypeScript
- @react-three/fiber & @react-three/drei (render 3D)
- TailwindCSS

---

## Cài đặt & Chạy cục bộ

Yêu cầu:
- Node.js >= 18
- pnpm / npm / yarn

Lệnh cài đặt & chạy:

```powershell
# Cài phụ thuộc
npm install

# Chạy môi trường dev
pnpm dev

# Build (production)
npm build
npm start
```

(Có thể thay `pnpm` bằng `npm` hoặc `yarn`.)

---

## Sử dụng

1. Mở app trong trình duyệt (mặc định: `http://localhost:3000`).
2. Tại panel Maze Configuration:
   - Tạo mê cung ngẫu nhiên hoặc dán lưới JSON 2D (0 = ô trống, 1 = tường).
   - Chọn tọa độ bắt đầu và đích; dùng các preset có sẵn.
3. Chọn thuật toán: `A*`, `BFS` hoặc `Compare`.
4. Nhấn `Preview Maze` hoặc `Solve Maze` để trực quan hóa.
5. Dùng panel Step Visualization để phát/tạm dừng từng bước và kiểm tra open/closed set.

---

## Thuật toán

- A*: Sử dụng khoảng cách Manhattan làm heuristic (phù hợp với di chuyển 4 hướng không chéo). Trả về đường ngắn nhất cùng snapshot từng bước.
- BFS: Đảm bảo đường ngắn nhất khi mọi cạnh có trọng số bằng nhau; dùng làm chuẩn so sánh.

---

## Scene 3D & Căn giữa

Lưới 3D dùng kích thước ô và khoảng cách cố định. Mỗi ô là một `mesh box`, và lưới được căn giữa bằng công thức `(gridSize - 1) * (cellSize + spacing) / 2` trên cả hai trục, đảm bảo điểm xoay (pivot) ở chính giữa lưới.
`OrbitControls` được gán target vào tâm lưới để xoay đúng tâm.

---

## Font & Hỗ trợ tiếng Việt

Dự án sử dụng `Noto Sans` và `Roboto Mono` thông qua `next/font/google`. `Noto Sans` (subsets `vietnamese`) giúp hiển thị tiếng Việt chính xác.

---

## Góp phần

Rất hoan nghênh các đóng góp:
1. Fork repo.
2. Tạo nhánh tính năng.
3. Thêm tests và tuân thủ coding style.
4. Mở PR kèm mô tả thay đổi.

---

## Giấy phép

MIT — xem file `LICENSE`  để biết chi tiết.
---

© Tran Ba Dat
