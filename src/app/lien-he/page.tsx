import FooterInfoPage from "@/src/components/FooterInfoPage";

const sections = [
  {
    title: "Hotline",
    body: "Gọi CakeShopMT qua số 0901 234 567 để được tư vấn bánh sinh nhật, bánh đặt riêng và lịch giao trong ngày.",
  },
  {
    title: "Email",
    body: "Gửi yêu cầu chi tiết, hình mẫu hoặc phản hồi dịch vụ đến hello@cakeshopmt.com. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
  },
  {
    title: "Giờ hỗ trợ",
    body: "Đội hỗ trợ hoạt động từ 8:00 đến 21:00 hằng ngày. Các đơn gấp nên liên hệ trực tiếp qua hotline để được kiểm tra lịch bếp.",
  },
  {
    title: "Địa chỉ tiệm",
    body: "CakeShopMT hiện phục vụ tại khu vực nội thành. Thông tin địa chỉ chi tiết sẽ được xác nhận khi khách hàng đặt lịch nhận bánh.",
  },
];

export default function ContactPage() {
  return (
    <FooterInfoPage
      description="Liên hệ với CakeShopMT để đặt bánh, hỏi về nguyên liệu, lịch giao hoặc gửi phản hồi sau khi sử dụng dịch vụ."
      eyebrow="Kết nối"
      sections={sections}
      title="Liên hệ với Chúng tôi"
    />
  );
}
