import type { CSSProperties } from "react";
import type { Product } from "@/src/types/product";
import { getProductImages } from "@/src/utils/products";

type ProductVisualProps = {
  product?: Product | null;
  className?: string;
  labelClassName?: string;
};

const fallbackStyles = [
  "bg-[radial-gradient(circle_at_50%_38%,#fff2df_0_12%,#ee9f78_13%_36%,#7d2f24_37%_100%)]",
  "bg-[radial-gradient(circle_at_50%_40%,#f4ffd8_0_13%,#88a650_14%_42%,#283d23_43%_100%)]",
  "bg-[radial-gradient(circle_at_50%_42%,#fff3f7_0_14%,#e75f98_15%_44%,#5b1633_45%_100%)]",
  "bg-[radial-gradient(circle_at_50%_40%,#fff4cb_0_13%,#e1a03d_14%_40%,#67320f_41%_100%)]",
];

function initials(name?: string) {
  return (name || "MT")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function fallbackIndex(product?: Product | null) {
  if (!product) {
    return 0;
  }

  return product.name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0) % fallbackStyles.length;
}

export default function ProductVisual({
  className = "",
  labelClassName = "",
  product,
}: ProductVisualProps) {
  const imageUrl = product ? getProductImages(product)[0] : undefined;
  const style: CSSProperties | undefined = imageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(40, 20, 14, 0.08), rgba(40, 20, 14, 0.16)), url(${imageUrl})`,
      }
    : undefined;

  return (
    <div
      aria-label={product?.name || "Sản phẩm CakeShopMT"}
      className={`relative overflow-hidden bg-cover bg-center ${className} ${
        imageUrl ? "bg-[#f2e8e1]" : fallbackStyles[fallbackIndex(product)]
      }`}
      role="img"
      style={style}
    >
      {!imageUrl && (
        <div className="absolute inset-x-0 bottom-0 flex h-1/2 items-end justify-center bg-gradient-to-t from-black/24 to-transparent pb-6">
          <span
            className={`grid h-16 w-16 place-items-center rounded-full bg-white/86 font-serif text-xl font-bold text-[#9a2a54] shadow-[0_16px_34px_rgba(70,32,28,0.2)] ${labelClassName}`}
          >
            {initials(product?.name)}
          </span>
        </div>
      )}
    </div>
  );
}
