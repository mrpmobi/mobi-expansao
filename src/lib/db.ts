import { createClient } from "@libsql/client"

const url = import.meta.env.VITE_TURSO_DATABASE_URL || "file:local.db"
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN || undefined

export const db = createClient({
  url,
  authToken,
})
