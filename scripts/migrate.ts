import oldDb from "../config/oldDb";
import newDb from "../config/newDb";

// Tables to migrate
const tables = [
  "users",
  "orders",
  "damages",
  "order_sizes",
  "categories",
  "stocks",
  "sub_categories",
  "release_stock",
  "price_group",
  "price_list",
  "transfer_stock",
  "purchase_stock",
  "order_price",
];

// JSON columns per table
const jsonColumnsMap: Record<string, string[]> = {
  orders: ["paper", "meta_data", "print_qtys"],
  damages: ["meta_data"],
};

async function migrateTable(tableName: string) {
  console.log(`🔁 Migrating table: ${tableName}`);

  try {
    // Check if table exists in oldDb
    const [exists] = await oldDb.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${tableName}')`
    );
    if (!exists) {
      console.log(`⚠️  Table ${tableName} does not exist in oldDb`);
      return;
    }

    // Check if table exists in newDb
    const [existsNew] = await newDb.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${tableName}')`
    );
    if (!existsNew) {
      console.log(`⚠️  Table ${tableName} does not exist in newDb`);
      return;
    }

    // Fetch data
    const [rows] = await oldDb.query(`SELECT * FROM ${tableName}`);
    const data = rows as Record<string, any>[];
    console.log(`✅ Found ${data.length} rows in ${tableName}`);

    const jsonCols = jsonColumnsMap[tableName] ?? [];
    let successCount = 0;

    // Initial loading line
    process.stdout.write(`🎉 Inserting... 0/${data.length} complete`);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      const columns = Object.keys(row)
        .map((col) => `"${col}"`)
        .join(", ");

      const values = Object.entries(row).map(([key, value]) => {
        if (jsonCols.includes(key)) {
          try {
            if (typeof value === "object" && value !== null) {
              return JSON.stringify(value);
            }
            if (
              typeof value === "string" &&
              (value.trim().startsWith("{") || value.trim().startsWith("["))
            ) {
              return JSON.stringify(JSON.parse(value));
            }
            return value;
          } catch {
            return value;
          }
        }
        return value === undefined ? null : value;
      });

      const placeholders = Object.keys(row)
        .map((key, idx) =>
          jsonCols.includes(key) ? `$${idx + 1}::jsonb` : `$${idx + 1}`
        )
        .join(", ");

      try {
        await newDb.query(
          `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
          { bind: values }
        );
        successCount++;

        // Update progress line
        process.stdout.write(
          `\r🎉 Inserting... ${successCount}/${data.length} complete`
        );
      } catch (err: any) {
        console.error(
          `\n❌ Row ${i + 1} insert failed in ${tableName}: ${err.message}`
        );
        console.error("   ➤ Offending row:", row);
      }
    }

    console.log(); // New line after loading
    console.log(
      `✅ ${successCount}/${data.length} rows migrated from ${tableName}\n`
    );

    if (successCount !== data.length) {
      throw new Error(
        `Partial migration: ${successCount} succeeded, ${
          data.length - successCount
        } failed.`
      );
    }
  } catch (err: any) {
    console.error(`❌ Failed to migrate table ${tableName}: ${err.message}`);
  }
}

async function migrateAll() {
  for (const table of tables) {
    await migrateTable(table);
  }

  await oldDb.close();
  await newDb.close();
  console.log("🎉✅ All migrations completed!");
}

migrateAll();
