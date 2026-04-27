import FooterInfoPage from "@/src/components/FooterInfoPage";

const sections = [
  {
    title: "Nguồn nguyên liệu",
    body: "CakeShopMT ưu tiên bơ, sữa, chocolate và trái cây có nguồn gốc rõ ràng. Mỗi mẻ bánh được ghi nhận thành phần chính để đội bếp kiểm soát chất lượng ổn định.",
  },
  {
    title: "Không che giấu phụ gia",
    body: "Những chất hỗ trợ kết cấu, màu sắc hoặc bảo quản nếu được sử dụng sẽ được ghi chú minh bạch. Chúng tôi tránh các thành phần không cần thiết trong công thức thủ công.",
  },
  {
    title: "Thông tin dị ứng",
    body: "Một số sản phẩm có thể chứa trứng, sữa, gluten, hạt hoặc đậu nành. Khách hàng có dị ứng nên thông báo trước khi đặt để đội bếp tư vấn lựa chọn phù hợp.",
  },
  {
    title: "Cập nhật theo mùa",
    body: "Trái cây và hương vị theo mùa có thể thay đổi nhẹ để giữ độ tươi. Khi có thay đổi quan trọng, CakeShopMT sẽ thông báo trong phần mô tả sản phẩm.",
  },
];

export default function IngredientTransparencyPage() {
  return (
    <FooterInfoPage
      description="Chúng tôi muốn khách hàng hiểu rõ chiếc bánh mình chọn được tạo nên từ đâu, có gì bên trong và cần lưu ý điều gì trước khi thưởng thức."
      eyebrow="CakeShopMT"
      sections={sections}
      title="Minh bạch Thành phần"
    />
  );
}
