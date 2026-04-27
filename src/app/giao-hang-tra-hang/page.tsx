import FooterInfoPage from "@/src/components/FooterInfoPage";

const sections = [
  {
    title: "Thời gian giao hàng",
    body: "Đơn bánh có sẵn thường được xử lý trong ngày. Bánh đặt riêng nên được đặt trước tối thiểu 24 đến 48 giờ để đội bếp chuẩn bị tốt nhất.",
  },
  {
    title: "Đóng gói và vận chuyển",
    body: "Bánh được đóng trong hộp cứng, có đế giữ ổn định và hướng dẫn bảo quản. Với bánh kem, khách hàng nên nhận trực tiếp để tránh rung lắc kéo dài.",
  },
  {
    title: "Kiểm tra khi nhận",
    body: "Vui lòng kiểm tra tình trạng bánh ngay khi nhận hàng. Nếu sản phẩm bị hỏng do vận chuyển, hãy chụp ảnh và liên hệ với chúng tôi trong ngày.",
  },
  {
    title: "Điều kiện trả hàng",
    body: "Vì bánh là sản phẩm tươi, CakeShopMT chỉ hỗ trợ đổi hoặc hoàn tiền khi có lỗi từ tiệm, sai mẫu đã xác nhận hoặc hư hỏng được ghi nhận lúc giao.",
  },
];

export default function ShippingReturnsPage() {
  return (
    <FooterInfoPage
      description="Thông tin về cách CakeShopMT chuẩn bị, giao bánh và xử lý các trường hợp cần đổi trả để khách hàng yên tâm khi đặt hàng."
      eyebrow="Hỗ trợ"
      sections={sections}
      title="Giao hàng & Trả hàng"
    />
  );
}
