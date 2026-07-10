// Fake Database implementation
import { useState, useEffect } from "react";

const initializeDB = () => {
  let initialized = false;
  let dbData = {};
  if (!localStorage.getItem("NEWLAB_DB_INIT")) {
    const defaultData = {
      staff: [
        {
          id: "1",
          name: "Jane Doe",
          role: "admin",
          email: "admin@newlab.com",
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
          total: 12500.0,
          items: [{ name: "Mass Spectrometer X-100", qty: 1 }],
          date: new Date().toISOString(),
        },
        {
          id: "POS-2001",
          type: "pos",
          cashier: "Jane Doe",
          status: "completed",
          total: 8200.0,
          items: [{ name: "High-Speed Centrifuge", qty: 1 }],
          date: new Date().toISOString(),
        },
      ],
      customers: [],
      categories: [
        { id: "C-1", name: "Spectrometers" },
        { id: "C-2", name: "Microscopes" },
        { id: "C-3", name: "Chromatographs" },
        { id: "C-4", name: "Centrifuges" }
      ],
      products: [
        {
          id: "1001",
          name: "Mass Spectrometer X-100",
          category: "Spectrometers",
          description: "High-resolution benchtop mass spectrometer for precise molecular analysis.",
          images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=60",
          ],
          variants: [
            { sku: "1001-S", color: "White", size: "Compact", price: 12500, stock: 12 },
            { sku: "1001-M", color: "White", size: "Standard", price: 15500, stock: 4 },
          ],
        },
        {
          id: "1002",
          name: "Electron Microscope Pro",
          category: "Microscopes",
          description: "Advanced scanning electron microscope with 1nm resolution.",
          images: [
            "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&auto=format&fit=crop&q=60",
          ],
          variants: [
            {
              sku: "1002-32",
              color: "Silver",
              size: "Floor",
              price: 85000,
              stock: 2,
            },
            {
              sku: "1002-34",
              color: "Black",
              size: "Floor",
              price: 85000,
              stock: 10,
            },
          ],
        },
        {
          id: "1003",
          name: "Gas Chromatograph GC-2000",
          category: "Chromatographs",
          description: "Automated gas chromatography system for volatile compounds.",
          images: [
            "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=60",
          ],
          variants: [
            { sku: "1003-L", color: "Grey", size: "Benchtop", price: 24500, stock: 6 },
          ],
        },
        {
          id: "1004",
          name: "High-Speed Centrifuge",
          category: "Centrifuges",
          description: "Ultra-fast refrigerated centrifuge for biological samples.",
          images: [
            "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop&q=60",
          ],
          variants: [
            { sku: "1004-M", color: "Black", size: "Standard", price: 8200, stock: 15 },
          ],
        },
      ],
      discounts: [], // specific products, categories, or entire inventory { id, type, target, value, percentage/fixed }
      coupons: [], // { id, code, value, type, expiry }
      inventory: [
        {
          id: "1001",
          sku: "1001-S",
          name: "Mass Spectrometer X-100",
          category: "Spectrometers",
          color: "White",
          size: "Compact",
          price: 12500,
          stock: 12,
        },
        {
          id: "1002",
          sku: "1001-M",
          name: "Mass Spectrometer X-100",
          category: "Spectrometers",
          color: "White",
          size: "Standard",
          price: 15500,
          stock: 4,
        },
        {
          id: "1003",
          sku: "1002-32",
          name: "Electron Microscope Pro",
          category: "Microscopes",
          color: "Silver",
          size: "Floor",
          price: 85000,
          stock: 2,
        },
        {
          id: "1004",
          sku: "1002-34",
          name: "Electron Microscope Pro",
          category: "Microscopes",
          color: "Black",
          size: "Floor",
          price: 85000,
          stock: 10,
        },
        {
          id: "1005",
          sku: "1003-L",
          name: "Gas Chromatograph GC-2000",
          category: "Chromatographs",
          color: "Grey",
          size: "Benchtop",
          price: 24500,
          stock: 6,
        },
        {
          id: "1006",
          sku: "1004-M",
          name: "High-Speed Centrifuge",
          category: "Centrifuges",
          color: "Black",
          size: "Standard",
          price: 8200,
          stock: 15,
        },
      ],
    };
    dbData = defaultData;
    initialized = true;
  } else {
    // Migration: populate missing arrays
    dbData = JSON.parse(localStorage.getItem("NEWLAB_DB") || "{}");
    if (!dbData.categories) dbData.categories = [
        { id: "C-1", name: "Spectrometers" },
        { id: "C-2", name: "Microscopes" },
        { id: "C-3", name: "Chromatographs" },
        { id: "C-4", name: "Centrifuges" }
    ];
    if (!dbData.products) dbData.products = [];
    if (!dbData.discounts) dbData.discounts = [];
    if (!dbData.coupons) dbData.coupons = [];
    initialized = true;
  }

  if (initialized) {
    localStorage.setItem("NEWLAB_DB", JSON.stringify(dbData));
    localStorage.setItem("NEWLAB_DB_INIT", "true");
  }
};

export const getDB = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem("NEWLAB_DB") || "{}");
};

export const saveDB = (data) => {
  localStorage.setItem("NEWLAB_DB", JSON.stringify(data));
};

export const useDB = () => {
  const [data, setData] = useState(getDB());

  const update = (newData) => {
    saveDB(newData);
    setData(newData);
    // Dispatch a custom event to sync across components
    window.dispatchEvent(new Event("NEWLAB_DB_UPDATED"));
  };

  useEffect(() => {
    const handleUpdate = () => setData(getDB());
    window.addEventListener("NEWLAB_DB_UPDATED", handleUpdate);
    return () => window.removeEventListener("NEWLAB_DB_UPDATED", handleUpdate);
  }, []);

  return { data, update };
};
