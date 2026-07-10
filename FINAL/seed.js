import pg from 'pg';

const { Client } = pg;

const DATABASE_URL = "postgresql://neondb_owner:npg_wUa8C6kAMGBr@ep-ancient-forest-aozxpu5j-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const client = new Client({
  connectionString: DATABASE_URL,
});

const products = [
  {
    sku: "HI2020W",
    name: "edge® Multiparameter pH Meter",
    description: "The edge® tablet meter is incredibly thin and lightweight, measuring just half an inch thick and weighing less than 9 ounces. edge® features a 5.5” LCD display that can be clearly viewed from over 5 meters.",
    price: 495.00,
    category: "Benchtop Meters",
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=800&auto=format&fit=crop"
  },
  {
    sku: "HI98107",
    name: "pHep® pH Tester",
    description: "The pHep® is a rugged, ergonomically designed pH tester that measures from 0.0 to 14.0 pH with an accuracy of ±0.1 pH.",
    price: 45.00,
    category: "Handheld Testers",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"
  },
  {
    sku: "HI98190",
    name: "Professional Waterproof Portable pH/ORP Meter",
    description: "The HI98190 is a rugged, portable pH/ORP meter with the performance and features of a benchtop meter.",
    price: 525.00,
    category: "Portable Meters",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop"
  },
  {
    sku: "HI931",
    name: "Automatic Titrator",
    description: "The HI931 Automatic Titrator is the answer to your dedicated titration needs. Fully customizable, the HI931 delivers accurate results and intuitive user experience.",
    price: 3500.00,
    category: "Automatic Titrators",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop"
  },
  {
    sku: "HI5221",
    name: "Research Grade pH/mV Meter",
    description: "The HI5221 is an advanced research grade benchtop pH/mV meter that is completely customizable with a large color LCD, capacitive touch keys, and USB port for computer connectivity.",
    price: 895.00,
    category: "Benchtop Meters",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=800&auto=format&fit=crop"
  },
  {
    sku: "HI98129",
    name: "Combo pH/Conductivity/TDS Tester",
    description: "The HI98129 Combo waterproof tester offers high accuracy pH, EC/TDS, and temperature measurements in a single tester.",
    price: 155.00,
    category: "Handheld Testers",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop"
  },
  {
    sku: "HI902C",
    name: "Automatic Titration System",
    description: "The HI902C is an automatic titrator that complements our wide range of products dedicated to efficient and accurate laboratory analysis.",
    price: 5500.00,
    category: "Automatic Titrators",
    image: "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?q=80&w=800&auto=format&fit=crop"
  },
  {
    sku: "HI9829",
    name: "Multiparameter Portable Meter",
    description: "The HI9829 is a waterproof portable logging multiparameter water quality meter that monitors up to 14 different parameters.",
    price: 1950.00,
    category: "Portable Meters",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop"
  }
];

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database.');

    // Delete existing products (to make it clean for Hanna products)
    await client.query('DELETE FROM Inventory');
    await client.query('DELETE FROM Order_Items');
    await client.query('DELETE FROM Products');
    await client.query('DELETE FROM Product_Categories');

    console.log('Existing catalog cleared.');

    for (const p of products) {
      // Find or create category
      let catRes = await client.query('SELECT id FROM Product_Categories WHERE name = $1', [p.category]);
      let categoryId;
      if (catRes.rows.length === 0) {
        catRes = await client.query('INSERT INTO Product_Categories (name) VALUES ($1) RETURNING id', [p.category]);
      }
      categoryId = catRes.rows[0].id;

      // Insert product
      const insertRes = await client.query(
        'INSERT INTO Products (category_id, sku, name, description, price, thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [categoryId, p.sku, p.name, p.description, p.price, p.image]
      );
      const productId = insertRes.rows[0].id;

      // Insert inventory
      await client.query('INSERT INTO Inventory (product_id, stock_quantity) VALUES ($1, $2)', [productId, 100]);
      
      console.log(`Inserted ${p.name}`);
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
  }
}

seed();
