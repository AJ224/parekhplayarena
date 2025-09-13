import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  const scriptsDir = path.join(process.cwd(), "scripts")
  const sqlFiles = fs
    .readdirSync(scriptsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()

  console.log("Running database migrations...")

  for (const file of sqlFiles) {
    console.log(`Running ${file}...`)

    const sqlContent = fs.readFileSync(path.join(scriptsDir, file), "utf8")

    const { error } = await supabase.rpc("exec_sql", { sql: sqlContent })

    if (error) {
      console.error(`Error running ${file}:`, error)
      process.exit(1)
    }

    console.log(`✅ ${file} completed`)
  }

  console.log("🎉 All migrations completed successfully!")
}

runMigrations().catch(console.error)
