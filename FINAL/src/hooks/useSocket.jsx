import { useState, useEffect } from "react";

// Mocking real-time socket layer for Inventory
export function useSocket() {
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // To simulate real-time POS sales happening elsewhere in the physical stores
    const interval = setInterval(() => {
      // Randomly occasionally trigger a stock decrease
      if (Math.random() > 0.5) {
        const dummySkus = ["1001-S", "1002-30", "1004-M", "1003-L"];
        const randomSku =
          dummySkus[Math.floor(Math.random() * dummySkus.length)];
        setLastUpdate({
          sku: randomSku,
          qtyChange: -1,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { lastUpdate };
}
