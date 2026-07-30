export const formatCurrency = (val: number) => {
  return val.toLocaleString("vi-VN") + "đ";
};

export const getBadgeStyle = (badgeName: string) => {
  const name = badgeName.toUpperCase();
  if (name.includes("VIP")) {
    return "bg-[#fce7ef] text-[#b73375] border border-[#f8c6d8]";
  } else if (name.includes("CHOCO")) {
    return "bg-[#fff4ef] text-[#bf5a3f] border border-[#fddbd0]";
  } else if (name.includes("VELVET") || name.includes("VANILLA")) {
    return "bg-[#fbf2ed] text-[#7d6a66] border border-[#ecdcd4]";
  }
  return "bg-gray-100 text-gray-600 border border-gray-200";
};
