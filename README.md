
# Sequelize Data Migration Tool

```md

A TypeScript-based migration tool to copy tables from an old PostgreSQL database to a new one using Sequelize.  
This script handles double-encoded JSON, raw object/array values, and supports JSON column casting (`::jsonb`).

```

## 📦 Project Structure

```

project-root/
├── config/
│   ├── oldDb.ts             # Sequelize connection to old database
│   └── newDb.ts             # Sequelize connection to new database
├── scripts/
│   └── migrate.ts           # Main migration script
├── .env                     # Environment variables
├── tsconfig.json            # TypeScript config
├── package.json             # Dependencies
└── README.md

````

---

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
npm run migrate
````

### 2. Create `.env` File

```env
# Old DB connection
OLD_DB_HOST=localhost
OLD_DB_USER=your_user
OLD_DB_PASSWORD=your_password
OLD_DB_NAME=old_database
OLD_DB_PORT=5432
OLD_DB_SSL=false

# New DB connection
NEW_DB_HOST=localhost
NEW_DB_USER=your_user
NEW_DB_PASSWORD=your_password
NEW_DB_NAME=new_database
NEW_DB_PORT=5432
NEW_DB_SSL=false
```

### 3. Configure JSON Columns (Optional)

Inside `migrate.ts`, define which columns are JSON per table:

```ts
const jsonColumnsMap: Record<string, string[]> = {
  orders: ["paper", "meta_data", "print_qtys"],
  damages: ["meta_data"],
};
```

---

## 🚀 Run Migration

```bash
npx ts-node scripts/migrate.ts
```

---

## 💡 Features

* ✅ Multi-table migration
* ✅ Double-encoded JSON detection & fix
* ✅ Raw JSON object/array support
* ✅ PostgreSQL `jsonb` column handling with `::jsonb` casts
* ✅ Per-row error logging with offending data
* ✅ Environment-based DB config
* ✅ Works without defining Sequelize models

---

## 📌 Notes

* This tool does not use Sequelize models.
* It queries raw data and re-inserts using native PostgreSQL query support.
* Failed rows (e.g., due to JSON issues) are logged with context.


---

