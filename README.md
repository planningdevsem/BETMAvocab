# BETMA Vocabulary Lab

Website tự học từ vựng TOEIC 500+ của BETMA ENGLISH (Beginner to Master): 5 chủ đề, 250 từ, flashcard, bài kiểm tra 20 câu và ôn tập. Không cần mật khẩu, không cần build.

## Đưa lên GitHub Pages
1. Tạo repository mới trên GitHub (ví dụ `betma-vocabulary-lab`, để Public).
2. Tải **toàn bộ nội dung bên trong thư mục này** lên repository (nút *Add file → Upload files*). Tệp `index.html` phải nằm ở thư mục gốc. Nhớ tải cả tệp ẩn `.nojekyll`.
3. Vào *Settings → Pages*. Mục *Build and deployment*: chọn *Deploy from a branch*, branch `main`, thư mục `/ (root)`, bấm *Save*.
4. Chờ 1–2 phút, trang sẽ có địa chỉ `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

Có thể dùng Netlify, Vercel hoặc Cloudflare Pages: kéo thả thư mục này, không cần cấu hình thêm. Chạy thử trên máy: mở `index.html` bằng trình duyệt.

## Thu thông tin người dùng về Google Sheet
Học viên điền Họ và tên, Số điện thoại, Email, Sinh viên năm mấy ở lần đầu vào trang. Thông tin được gửi về Google Sheet qua Google Apps Script. Mỗi người có tiến độ riêng; nhiều người có thể dùng chung một thiết bị bằng nút “Đổi người dùng”.

1. Mở Google Sheet cần thu dữ liệu bằng tài khoản chủ sở hữu → *Tiện ích mở rộng (Extensions) → Apps Script*.
2. Xóa mã mẫu, dán toàn bộ nội dung tệp `google-apps-script/Code.gs`, bấm Lưu.
3. Bấm *Triển khai (Deploy) → Tùy chọn triển khai mới → loại Ứng dụng web*. Đặt *Thực thi bằng: Tôi*, *Người có quyền truy cập: Bất kỳ ai*. Bấm Triển khai và cấp quyền khi Google hỏi.
4. Sao chép **URL ứng dụng web** (kết thúc bằng `/exec`), mở `js/config.js` và dán vào `ENDPOINT`, ví dụ `ENDPOINT:"https://script.google.com/macros/s/.../exec"`.
5. Tải lại `js/config.js` lên GitHub. Đăng ký thử một người và kiểm tra tab **Đăng ký** trong Sheet (tab tự được tạo).

Lưu ý:
- Sheet nên để chế độ **hạn chế** (chỉ người được mời), không chia sẻ công khai, vì có số điện thoại và email.
- URL ứng dụng web nằm trong mã nguồn công khai nên ai cũng có thể gửi dữ liệu rác. Đã có trường chống bot và kiểm tra dữ liệu, nhưng nên thỉnh thoảng rà soát Sheet.
- Nếu sửa `Code.gs`, phải Triển khai lại bằng *Quản lý triển khai → Chỉnh sửa → Phiên bản mới*.
- Đây là dữ liệu cá nhân: nên có thông báo quyền riêng tư cho học viên và chỉ dùng đúng mục đích đã nêu.
- Không có đăng nhập: người dùng được nhận diện theo số điện thoại trên từng thiết bị. Dùng thiết bị khác sẽ phải đăng ký lại và tạo thêm một dòng trong Sheet (có thể lọc trùng theo cột số điện thoại).

## Cấu trúc
- `index.html`: giao diện.
- `css/style.css`: kiểu dáng, màu thương hiệu `#D3222B`.
- `js/app.js`: logic flashcard, tiến độ, bài kiểm tra, ôn tập.
- `js/data.js`: dữ liệu 250 từ. Mỗi từ gồm `id`, `t` (chủ đề), `w` (từ), `ipa`, `pos`, `vi` (nghĩa), `en`/`ev` (ví dụ và bản dịch); từ mục tiêu trong `en` nằm giữa `**`.
- `js/config.js`: địa chỉ Google Sheet (ENDPOINT).
- `google-apps-script/Code.gs`: mã dán vào Google Apps Script.
- `assets/`: logo và biểu tượng.

## Lưu ý
- Tiến độ lưu bằng `localStorage` theo từng thiết bị và từng tên miền. Đổi tên miền hoặc xóa dữ liệu trình duyệt sẽ mất tiến độ. Khóa lưu là `betma_vl_v1`.
- Phát âm dùng giọng đọc có sẵn của trình duyệt (Web Speech API), chất lượng tùy thiết bị.
- Dữ liệu hiện có 12 từ trùng giữa các chủ đề (distribute, inquiry, budget, investment, profit, loss, benefit, purchase, promotion, invoice, receipt). Nên thay bằng từ mới trong `js/data.js` nếu muốn đủ 250 từ khác nhau.
- Logo là tài sản thương hiệu của BETMA ENGLISH.
