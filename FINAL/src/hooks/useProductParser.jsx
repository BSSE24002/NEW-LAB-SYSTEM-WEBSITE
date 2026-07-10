import { useMemo } from "react";

export function useProductParser(attributes) {
  return useMemo(() => {
    let totalStock = 0;
    const sizesList = Object.entries(attributes.sizes).map(([size, stock]) => {
      totalStock += stock;
      return {
        size,
        stock,
        disabled: stock === 0,
      };
    });

    return {
      color: attributes.color,
      sizesList,
      totalStock,
    };
  }, [attributes]);
}
