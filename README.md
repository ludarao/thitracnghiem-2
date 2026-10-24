# Thi trắc nghiệm — app độc lập số 2

Bản sao độc lập từ `ludarao/thitracnghiem`, nhánh `codex/local-exam-guard-v1.3`, commit `41a821b18e06e16701b495ddb69cfbb87edab0c6` ngày 19/10/2026. Giữ giao diện, logo, câu hỏi và chức năng của mã nguồn hiện có. Repo nguồn và app đang chạy không bị thay đổi.

## Chức năng hiện tại

- Đăng ký bằng viết tắt họ tên và số điện thoại; mục đơn vị được ẩn, mã ví dụ `ptb0985728123`.
- Thi lại nhiều lần; xếp hạng lấy điểm cao nhất, bằng điểm lấy lượt nhanh nhất, rồi lượt nộp mới hơn.
- Đáp án/tiến độ lưu trên máy, nộp một lần và có thể gửi lại khi lỗi mạng; server chấm điểm và chống lưu trùng.
- Dashboard: 20 thí sinh/trang (che 4 số cuối điện thoại); ẩn cột đơn vị và bảng xếp hạng đơn vị.
- Admin nhập câu hỏi/đơn vị qua Excel, xuất toàn bộ lượt nộp ra Excel, sao lưu JSON và xóa dữ liệu có xác nhận mật khẩu.
- Giám sát rời tab/ứng dụng và chống copy theo cấu hình, xử lý local; xác minh Turnstile tùy chọn.

Mục đơn vị được ẩn trên giao diện công khai, kể cả khi làm bài và xem kết quả. Lượt đăng ký mới không gửi đơn vị sẽ lưu chuỗi rỗng; không tự gán vào đơn vị đầu tiên. Schema, dữ liệu đơn vị cũ, quản trị và xuất dữ liệu vẫn được giữ, không cần migration.

## Triển khai app mới

1. Vào Vercel → Add New → Project → import repo `ludarao/thitracnghiem-2`, dùng nhánh `main`, framework Next.js, thư mục gốc `./`.
2. Tạo **database Prisma Postgres mới** qua Marketplace/Storage và chỉ kết nối với project mới. Không chọn database của app cũ, không sao chép URL hoặc khóa bí mật từ project cũ.
3. Đảm bảo có URL TCP PostgreSQL (`postgres://` hoặc `postgresql://`): `DATABASE_URL` cho app và `DATABASE_URL_UNPOOLED` cho migration. Nếu integration cung cấp URL Accelerate (`prisma://` hoặc `prisma+postgres://`) trong `DATABASE_URL`, cấu hình URL TCP riêng ở `DATABASE_POSTGRES_URL`; app nhận biến này khi `DATABASE_URL` không phải TCP. `DIRECT_URL` cũng được hỗ trợ cho migration. Chọn Production; Preview chỉ nối cùng database này nếu chấp nhận Preview và Production chia sẻ dữ liệu.
4. Thêm Environment Variables (Secret cho mật khẩu/khóa):
   - `ADMIN_PASSWORD`: mật khẩu riêng từ 10 đến 200 ký tự. Chỉ dùng khởi tạo Admin lần đầu; sau đó đổi tại trang Admin.
   - `EXAM_TOKEN_SECRET`: chuỗi ngẫu nhiên riêng ít nhất 32 ký tự, giữ ổn định giữa các lần deploy. Bắt buộc ngay cả khi tắt Turnstile.
   - `TURNSTILE_ENABLED=false` để triển khai ban đầu không cần widget xác minh. Nếu muốn bật, tạo widget cho hostname của app mới, đặt `TURNSTILE_ENABLED=true`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
5. Dùng Node.js 22.13+ (có thể dùng Node 24). Build Command là `npm run vercel-build`, đã đặt trong `vercel.json`. Lệnh này áp dụng migration rồi build. Deploy lại sau khi thêm đủ biến và kết nối database.
6. Chờ Ready, mở `/admin`, đăng nhập mật khẩu mới. Kiểm tra tiêu đề, danh sách đơn vị, câu hỏi, thời gian và cấu hình giám sát rồi lưu. Tạo bài thử, nộp, kiểm tra dashboard và file Excel trước khi tổ chức thi.

Không có file bí mật hoặc liên kết `.vercel` của app cũ trong bản sao. Database mới ban đầu rỗng; app tạo cấu hình và ngân hàng đề mặc định từ mã nguồn khi sử dụng. Cấu hình/đề/đơn vị đã chỉnh trực tiếp trên database app cũ không tự được sao chép. Có thể nhập lại qua các chức năng Excel hiện có; file JSON sao lưu chưa có chức năng khôi phục tự động.

Nếu lần deploy đầu báo thiếu database, hoàn tất bước kết nối/biến môi trường rồi Redeploy, không sửa mã nguồn để bỏ migration. Database riêng giúp tách dữ liệu; quota sử dụng còn tùy gói và phạm vi tài khoản của nhà cung cấp.

## Chạy và kiểm tra local

Yêu cầu Node.js 22.13+ và database PostgreSQL riêng.

```sh
npm ci
cp .env.local.example .env.local
# Tự điền URL database, ADMIN_PASSWORD và EXAM_TOKEN_SECRET vào .env.local.
npm run db:migrate
npm run dev
```

`npm test`, `npm run typecheck`, `npm run build` kiểm tra mã nguồn. `npm run build` riêng không sửa database. `npm run vercel-build` chạy migration thực tế nên chỉ dùng khi đã trỏ đúng database mới.

## Tài liệu

- [Nhận diện thí sinh](docs/IDENTITY-INITIALS-PHONE.md)
- [Dashboard](docs/DASHBOARD-RANKINGS.md)
- [Bảo vệ phiên và khóa ký](docs/SECURITY-SESSION-1.3.md)
- [Tài liệu cũ, có nội dung của các phiên bản trước](docs/README-LEGACY.md)
- [Hướng dẫn tích hợp Prisma Postgres với Vercel](https://www.prisma.io/docs/guides/postgres/vercel)
- [Triển khai Git repository trên Vercel](https://vercel.com/docs/git)
