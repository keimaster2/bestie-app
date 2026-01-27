"use client";

import { useState } from "react";

export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  // 楽天の画像URLには ?_ex=128x128 のようなサイズ指定がついている場合があるが
  // それを削除するとオリジナルが見れる場合と、見れない場合がある。
  // 今回はまずそのまま表示してみて、エラーならプレースホルダーにするシンプルな構成に戻す
  const [imgSrc, setImgSrc] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className="max-w-full max-h-[400px] object-contain mix-blend-multiply"
      onError={() => {
        // 画像読み込み失敗時のフォールバック
        setImgSrc("/placeholder.svg");
      }}
    />
  );
}
