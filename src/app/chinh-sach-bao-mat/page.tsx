import FooterInfoPage from "@/src/components/FooterInfoPage";

const sections = [
  {
    title: "Thông tin chúng tôi thu thập",
    body: "Khi tạo tài khoản hoặc đặt bánh, CakeShopMT có thể lưu họ tên, số điện thoại, địa chỉ giao hàng và thông tin cần thiết để xử lý đơn hàng.",
  },
  {
    title: "Mục đích sử dụng",
    body: "Thông tin được dùng để xác nhận tài khoản, liên hệ giao hàng, hỗ trợ khách hàng và cải thiện trải nghiệm đặt bánh trên website.",
  },
  {
    title: "Bảo vệ dữ liệu",
    body: "Mật khẩu được xử lý bảo mật phía máy chủ. Cookie đăng nhập được đặt ở chế độ httpOnly để hạn chế truy cập từ mã phía trình duyệt.",
  },
  {
    title: "Quyền của khách hàng",
    body: "Khách hàng có thể yêu cầu cập nhật, kiểm tra hoặc xóa thông tin cá nhân bằng cách liên hệ với CakeShopMT qua trang liên hệ.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <FooterInfoPage
      description="Chính sách này giải thích cách CakeShopMT xử lý thông tin cá nhân khi khách hàng sử dụng website và dịch vụ đặt bánh."
      eyebrow="Hỗ trợ"
      sections={sections}
      title="Chính sách Bảo mật"
    />
  );
}
