import FooterInfoPage from "@/src/components/FooterInfoPage";

const sections = [
  {
    title: "Bắt đầu từ căn bếp nhỏ",
    body: "CakeShopMT được xây dựng từ niềm yêu thích những chiếc bánh mềm, thơm và được trang trí bằng tay. Mỗi sản phẩm hướng đến cảm giác gần gũi nhưng vẫn đủ tinh tế cho những dịp quan trọng.",
  },
  {
    title: "Thủ công là trọng tâm",
    body: "Từ đánh kem, cân lớp bánh đến hoàn thiện bề mặt, đội bếp ưu tiên thao tác thủ công để mỗi chiếc bánh có cá tính riêng và giữ được độ tươi mới.",
  },
  {
    title: "Hương vị Việt, kỹ thuật Âu",
    body: "Chúng tôi kết hợp nguyên liệu quen thuộc với kỹ thuật làm bánh hiện đại, tạo ra các lựa chọn phù hợp khẩu vị địa phương nhưng vẫn có cấu trúc đẹp mắt.",
  },
  {
    title: "Chế tác cho từng khoảnh khắc",
    body: "Bánh không chỉ là món tráng miệng. Với CakeShopMT, đó là phần ký ức của sinh nhật, buổi họp mặt, lời cảm ơn và những ngày cần một chút ngọt ngào.",
  },
];

export default function StoryPage() {
  return (
    <FooterInfoPage
      description="Một tiệm bánh nhỏ tập trung vào nguyên liệu tử tế, kỹ thuật chỉn chu và trải nghiệm đặt bánh dễ chịu cho khách hàng."
      eyebrow="Câu chuyện"
      sections={sections}
      title="Câu chuyện của Chúng tôi"
    />
  );
}
