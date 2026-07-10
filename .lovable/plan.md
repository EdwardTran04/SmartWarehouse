## Mục tiêu

Sau khi user xác nhận lệnh xuất, mở wizard gom order → sắp lịch xe → gửi thông báo cho đối tác → nhận xác nhận. Dữ liệu lưu trên Lovable Cloud; xe/tuyến dùng mock.

## Luồng người dùng

```text
[DS lệnh xuất]
  └─ Chọn ≥1 order → "Xác nhận lệnh xuất"
      └─ Dialog Wizard 4 bước:
          B1. Xác nhận order
              - Check có/không thông tin vận chuyển của order
          B2. Gom order (tự động, có thể chỉnh)
              TH1 (có vận chuyển): Đơn vị nhận hàng → đủ tải trọng xe → tuyến đường
              TH2 (không vận chuyển): chỉ theo Đơn vị nhận hàng
              - Hiện các nhóm gom, tổng khối lượng/thể tích
          B3. Order xe & sắp lịch
              - Hệ thống gợi ý loại xe theo tổng tải trọng nhóm
              - User chọn ngày/giờ, biển số (mock danh mục xe)
              - Cho phép thêm/xóa order khỏi chuyến trước khi duyệt
              - "Duyệt lịch xe"
          B4. Gửi thông báo đối tác
              - Chọn kênh: Email / SMS / Notification
              - Preview nội dung → "Gửi"
              - Sinh link xác nhận cho đối tác
[Trang /outbound/shipments]  (mới)
  - Danh sách chuyến vận chuyển, trạng thái: Chờ duyệt / Đã duyệt / Đã gửi ĐT / ĐT xác nhận / Đang vận chuyển
[Trang /partner-confirm/:token]  (public)
  - Đối tác xem chi tiết chuyến, bấm "Xác nhận" → update hệ thống
```

## Backend (Lovable Cloud)

Tables:
- `shipments` (id, code, status, vehicle_type, plate_no, planned_at, receiver_name, total_weight, total_volume, partner_email, partner_phone, partner_token, partner_confirmed_at, created_by, created_at)
- `shipment_orders` (id, shipment_id, order_code, receiver_name, weight, volume, route_code)
- Enum `shipment_status`: `draft, approved, notified, partner_confirmed, in_transit, delivered`

RLS: authenticated CRUD trên shipment của mình; anon SELECT/UPDATE `shipments` theo `partner_token` (dùng RPC `get_shipment_by_token`, `confirm_shipment_by_token` — SECURITY DEFINER).

Edge functions:
- `send-shipment-notification` — gửi email (Lovable Emails) + tùy chọn SMS/Notification. Sinh link `/partner-confirm/<token>`.
- Nhánh SMS: nếu chưa có provider → mock ghi log; đề xuất Twilio sau nếu user cần thật.

## Mock danh mục (frontend)

`src/data/fleet.ts`:
- Vehicles: 500kg, 1T, 1.5T, 3.5T, 8T, 15T (kèm max_volume_m3)
- Routes: HN-HP, HN-DN, HCM-CT, HCM-BD, ...
- Partners: 4-5 nhà vận chuyển mẫu (tên, email, sđt)

## Thuật toán gom (client-side, `src/lib/consolidate.ts`)

```text
input: orders[]  (each: receiver, weight, volume, route, hasTransport)
1. Tách nhóm có/không vận chuyển.
2. Với TH có vận chuyển: groupBy(receiver) → trong mỗi group, dồn vào "chuyến" đến khi vượt tải trọng xe lớn nhất → tách chuyến mới cùng tuyến; nếu tuyến khác thì split theo route.
3. Với TH không vận chuyển: groupBy(receiver) → 1 chuyến / receiver.
4. Với mỗi chuyến: pick vehicle nhỏ nhất mà tải ≥ tổng weight & volume.
```

## Files sẽ thay đổi/tạo

- `src/pages/Outbound.tsx` — nút "Xác nhận lệnh xuất" mở `ConsolidateWizard`; thêm entry menu "Chuyến vận chuyển".
- `src/components/outbound/ConsolidateWizard.tsx` (mới) — 4 bước.
- `src/pages/Shipments.tsx` (mới) — danh sách + chỉnh sửa chuyến trước duyệt.
- `src/pages/PartnerConfirm.tsx` (mới) — public route.
- `src/lib/consolidate.ts` (mới).
- `src/data/fleet.ts` (mới).
- `src/App.tsx` — thêm route `/outbound/shipments`, `/partner-confirm/:token`.
- Migration Cloud: tables + RLS + RPC + grants.
- Edge function `send-shipment-notification` + template React Email `shipment-notification`.

## Ngoài phạm vi (lần này)

- SMS thật (dùng mock log; nếu bạn muốn Twilio thật sẽ làm ở bước sau).
- Realtime tracking chuyến.

Bấm Approve để mình triển khai theo plan này.
