import pool from "@/lib/db";

export default async function TestDatabasePage() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    return (
      <main style={{ padding: "2rem" }}>
        <h1>Database Connection Successful</h1>

        <p>Connected to Engineering_db.</p>

        <p>
          PostgreSQL time:{" "}
          {result.rows[0].current_time.toString()}
        </p>
      </main>
    );
  } catch (error) {
    console.error("Database connection failed:", error);

    return (
      <main style={{ padding: "2rem" }}>
        <h1>Database Connection Failed</h1>

        <p>Check the terminal for the error.</p>
      </main>
    );
  }
}