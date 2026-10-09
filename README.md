# DISC riêng tư

Bài trắc nghiệm 28 câu với biểu đồ đường D–I–S–C, tính kết quả ngay trong trình duyệt. Không tài khoản, không hỏi họ tên/email/số điện thoại, không gửi câu trả lời lên máy chủ.

## Làm test

Mở website công khai từ mục **About** của repo hoặc mở `index.html` trên máy. Bản HTML chạy được ngoại tuyến, không cần cài đặt.

1. Chọn bối cảnh làm việc, học tập, gia đình, bạn bè hoặc công cộng.
2. Mỗi câu chọn một mô tả giống bạn nhất và một mô tả khác bạn nhất.
3. Trả lời đủ 28 câu để xem biểu đồ và kết quả. Có thể quay lại sửa từng câu.
4. Chuyển biểu đồ giữa **Hiệu số**, **Giống nhất**, **Khác nhất**; tải SVG, TXT hoặc JSON nếu muốn giữ lại.

Đổi bối cảnh sẽ bắt đầu bài mới. Bài làm không tự lưu; đóng hoặc tải lại trang sẽ mất câu trả lời. Nút xóa yêu cầu xác nhận. Các file đã tải về vẫn do bạn tự quản lý.

## Cách tính và giới hạn

Giữ nguyên 28 nhóm mô tả công khai của [Vita Share](https://congcu.vita-share.com/disc), đối chiếu ngày 08/10/2026. Đây là một bản độc lập; không liên kết hay đại diện cho Vita Share, không dùng logo hoặc mã ứng dụng của họ.

Phần client công khai của trang gốc không chứa thuật toán chuẩn hóa biểu đồ. Vì vậy bản này dùng thống kê thô độc lập: đếm số lượt giống nhất, số lượt khác nhất và **hiệu số = giống nhất − khác nhất**. Gán nhóm dựa trên nội dung mô tả: mã 1=S, 2=C, 3=D, 4=I; chưa xác minh đây là khóa chấm của máy chủ Vita Share.

Biểu đồ hiệu số có thang cố định **−28 đến +28** và đường mức 0. Hai biểu đồ số lượt chọn có thang **0 đến 28**. Không tự co giãn trục theo đáp án, không làm tròn hay tạo phần trăm. Giữ tất cả nhóm cùng có hiệu số cao nhất.

**Kết quả chưa tương đương biểu đồ chuẩn hóa của Vita Share.** Điểm dùng để suy ngẫm về hành vi trong bối cảnh đã chọn; không phải tỷ lệ tính cách, năng lực hoặc dự báo nghề nghiệp.

## Quyền riêng tư

- Không có backend nhận bài làm, analytics, tracker hay dịch vụ gửi email.
- Không tải script, font, thư viện biểu đồ hoặc tài nguyên bên ngoài.
- Không tự lưu đáp án/kết quả vào cookie, localStorage, sessionStorage hay IndexedDB.
- Tất cả phép tính và file xuất được tạo trên máy người làm test; CSP chặn kết nối và gửi form của ứng dụng.
- Khi truy cập bản web, nhà cung cấp hosting có thể ghi nhận IP, thời điểm và metadata truy cập theo chính sách của họ. Ứng dụng không gửi câu trả lời hoặc kết quả trong request, URL hoặc log.
- Có thể lưu file HTML rồi ngắt Internet để sử dụng ngoại tuyến.

## Mã nguồn

Không cần tải dependency. Sau khi chỉnh mã, chạy bằng Node.js:

```sh
node build.cjs
node --test test.cjs
```

- `app-source.js`: câu hỏi, flow, tính điểm, SVG và xuất file.
- `questions.json`: 28 nhóm mô tả từ nguồn công khai.
- `style-source.css`, `chart-source.css`: giao diện và biểu đồ.
- `build.cjs`: tạo lại `index.html` cùng CSP hash.
- `index.html`: bản hoàn chỉnh để dùng online hoặc offline.
- `SOURCES.json`: nguồn và phạm vi dữ liệu bên thứ ba.

Không chỉnh riêng inline script/style trong `index.html`; sửa nguồn rồi build để hash CSP khớp. GitHub Pages phục vụ trang tĩnh từ nhánh `main`, thư mục gốc.

## Nguồn bên thứ ba

Bộ câu hỏi được ghi nguồn Vita Share, không có xác nhận giấy phép tái phân phối trong tài liệu đã kiểm tra. Repository không tuyên bố sở hữu hay cấp lại giấy phép cho bộ câu hỏi này. Các ảnh tham khảo/logo và mã ứng dụng gốc không nằm trong repository.
