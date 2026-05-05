import type { Product } from "@/src/types/product";

const categoryLabels: Record<string, string> = {
  accessory: "Phụ kiện",
  banner: "Băng rôn",
  "bang ron": "Băng rôn",
  "bang-ron": "Băng rôn",
  "băng rôn": "Băng rôn",
  birthday: "Sinh nhật",
  cake: "Bánh kem",
  candle: "Nến",
  nen: "Nến",
  "nến": "Nến",
  cupcake: "Cupcake",
  hat: "Mũ",
  mu: "Mũ",
  "mũ": "Mũ",
  mousse: "Mousse",
  seasonal: "Theo mùa",
  signature: "Signature",
  wedding: "Cưới hỏi",
};

const cakeCategories = new Set([
  "banh kem",
  "banh-kem",
  "bánh kem",
  "birthday",
  "birthday-cake",
  "cake",
  "custom-cake",
  "cupcake",
  "mousse",
  "seasonal",
  "signature",
  "wedding",
]);

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  currency: "VND",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatCurrency(price: number) {
  return currencyFormatter.format(Number.isFinite(price) ? price : 0);
}

export function formatCategory(category?: string) {
  if (!category) {
    return "Khác";
  }

  const normalized = category.trim().toLowerCase();
  if (categoryLabels[normalized]) {
    return categoryLabels[normalized];
  }

  return category
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getProductImages(product: Product) {
  return Array.from(
    new Set([product.imageUrl, ...(product.images ?? [])].filter(Boolean)),
  ) as string[];
}

export function isCakeProduct(product: Product) {
  return cakeCategories.has(product.category.trim().toLowerCase());
}

export function productRequiresStock(product: Product) {
  return !isCakeProduct(product);
}

export function isProductAvailable(product: Product) {
  if (!product.isAvailable) {
    return false;
  }

  if (!productRequiresStock(product)) {
    return true;
  }

  return typeof product.stock === "number" && product.stock > 0;
}
