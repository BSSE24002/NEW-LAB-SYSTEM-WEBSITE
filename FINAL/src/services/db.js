// Fake Database implementation
import { useState, useEffect } from "react";

const initializeDB = () => {
  let initialized = false;
  let dbData = {};
  if (!localStorage.getItem("DRAPE_DB_INIT")) {
    const defaultData = {
      staff: [
        {
          id: "1",
          name: "Jane Doe",
          role: "admin",
          email: "admin@drape.com",
          pin: "1234",
        },
      ],
      orders: [
        {
          id: "ORD-1001",
          type: "online",
          customerEmail: "john@example.com",
          customerPhone: "555-0100",
          status: "pending",
          total: 125.0,
          items: [{ name: "Heavyweight Box Tee", qty: 1 }],
          date: new Date().toISOString(),
        },
        {
          id: "POS-2001",
          type: "pos",
          cashier: "Jane Doe",
          status: "completed",
          total: 45.0,
          items: [{ name: "Premium Dad Cap", qty: 1 }],
          date: new Date().toISOString(),
        },
      ],
      customers: [],
      categories: [
        { id: "C-1", name: "Tops" },
        { id: "C-2", name: "Bottoms" },
        { id: "C-3", name: "Knitwear" },
        { id: "C-4", name: "Outerwear" }
      ],
      products: [
        {
          id: "1001",
          name: "Heavyweight Box Tee",
          category: "Tops",
          description: "Premium heavy weight cotton tee with a boxy fit.",
          images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
          ],
          variants: [
            { sku: "1001-S", color: "White", size: "S", price: 65, stock: 12 },
            { sku: "1001-M", color: "White", size: "M", price: 65, stock: 4 },
          ],
        },
        {
          id: "1002",
          name: "Pleated Trousers",
          category: "Bottoms",
          description: "Relaxed fit pleated trousers naturally dyed.",
          images: [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=60",
          ],
          variants: [
            {
              sku: "1002-32",
              color: "Olive",
              size: "32",
              price: 185,
              stock: 2,
            },
            {
              sku: "1002-34",
              color: "Olive",
              size: "34",
              price: 185,
              stock: 10,
            },
          ],
        },
        {
          id: "1003",
          name: "Cashmere Crew",
          category: "Knitwear",
          description: "Ultra-soft cashmere crewneck sweater.",
          images: [
            "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=800&auto=format&fit=crop&q=60",
          ],
          variants: [
            { sku: "1003-L", color: "Grey", size: "L", price: 245, stock: 6 },
          ],
        },
        {
          id: "1004",
          name: "Chore Coat",
          category: "Outerwear",
          description: "Durable cotton canvas chore coat.",
          images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=60",
          ],
          variants: [
            { sku: "1004-M", color: "Black", size: "M", price: 210, stock: 15 },
          ],
        },
      ],
      discounts: [], // specific products, categories, or entire inventory { id, type, target, value, percentage/fixed }
      coupons: [], // { id, code, value, type, expiry }
      inventory: [
        {
          id: "1001",
          sku: "1001-S",
          name: "Heavyweight Box Tee",
          category: "Tops",
          color: "White",
          size: "S",
          price: 65,
          stock: 12,
        },
        {
          id: "1002",
          sku: "1001-M",
          name: "Heavyweight Box Tee",
          category: "Tops",
          color: "White",
          size: "M",
          price: 65,
          stock: 4,
        },
        {
          id: "1003",
          sku: "1002-32",
          name: "Pleated Trousers",
          category: "Bottoms",
          color: "Olive",
          size: "32",
          price: 185,
          stock: 2,
        },
        {
          id: "1004",
          sku: "1002-34",
          name: "Pleated Trousers",
          category: "Bottoms",
          color: "Olive",
          size: "34",
          price: 185,
          stock: 10,
        },
        {
          id: "1005",
          sku: "1003-L",
          name: "Cashmere Crew",
          category: "Knitwear",
          color: "Grey",
          size: "L",
          price: 245,
          stock: 6,
        },
        {
          id: "1006",
          sku: "1004-M",
          name: "Chore Coat",
          category: "Outerwear",
          color: "Black",
          size: "M",
          price: 210,
          stock: 15,
        },
      ],
    };
    dbData = defaultData;
    initialized = true;
  } else {
    // Migration: populate missing arrays
    dbData = JSON.parse(localStorage.getItem("DRAPE_DB") || "{}");
    if (!dbData.categories) dbData.categories = [
        { id: "C-1", name: "Tops" },
        { id: "C-2", name: "Bottoms" },
        { id: "C-3", name: "Knitwear" },
        { id: "C-4", name: "Outerwear" }
    ];
    if (!dbData.products) dbData.products = [];
    if (!dbData.discounts) dbData.discounts = [];
    if (!dbData.coupons) dbData.coupons = [];
    initialized = true;
  }

  if (initialized) {
    localStorage.setItem("DRAPE_DB", JSON.stringify(dbData));
    localStorage.setItem("DRAPE_DB_INIT", "true");
  }
};

export const getDB = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem("DRAPE_DB") || "{}");
};

export const saveDB = (data) => {
  localStorage.setItem("DRAPE_DB", JSON.stringify(data));
};

export const useDB = () => {
  const [data, setData] = useState(getDB());

  const update = (newData) => {
    saveDB(newData);
    setData(newData);
    // Dispatch a custom event to sync across components
    window.dispatchEvent(new Event("DRAPE_DB_UPDATED"));
  };

  useEffect(() => {
    const handleUpdate = () => setData(getDB());
    window.addEventListener("DRAPE_DB_UPDATED", handleUpdate);
    return () => window.removeEventListener("DRAPE_DB_UPDATED", handleUpdate);
  }, []);

  return { data, update };
};
