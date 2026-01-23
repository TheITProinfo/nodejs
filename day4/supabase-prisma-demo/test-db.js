// require("dotenv").config();
const { Client } = require("pg");

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required by Supabase
  });

  try {
    console.log("Connecting to Supabase Postgres...");
    await client.connect();

    const res = await client.query("SELECT NOW() as server_time;");
    console.log("Connected successfully!");
    console.log("Server time:", res.rows[0].server_time);

  } catch (err) {
    console.error("Connection failed:");
    console.error(err.message);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

testConnection();
