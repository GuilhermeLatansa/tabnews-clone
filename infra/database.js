import { Client } from "pg";

async function getPostgresVersionNumberAsJson() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  try {
    await client.connect();

    // Execute the query to get just the version number
    const queryResult = await client.query("SHOW server_version;");

    // The result value is in the 'setting' field
    const versionNumber = queryResult.rows[0].server_version;

    console.log("\nPostgreSQL Version Number (JSON):");
    console.log(versionNumber);

    return versionNumber;
  } catch (err) {
    console.error("Error retrieving PostgreSQL version number:", err.message);
  } finally {
    await client.end();
  }
}

async function getPostgresMaxConnections() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  try {
    await client.connect();
    const queryResult = await client.query("SHOW max_connections;");
    const maxConnections = queryResult.rows[0].max_connections;

    console.log("\nPostgreSQL Max Connections (JSON):");
    console.log(maxConnections);

    return maxConnections;
  } catch (err) {
    console.error("Error retrieving PostgreSQL Max Connections:", err.message);
  } finally {
    await client.end();
  }
}

async function getPostgresUsedConnections() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  try {
    await client.connect();
    const databaseName = process.env.POSTGRES_DB;
    const queryResult = await client.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const usedConnections = queryResult.rows[0].count;

    console.log("\nPostgreSQL Used Connections (JSON):");
    console.log(usedConnections);

    return usedConnections;
  } catch (err) {
    console.error("Error retrieving PostgreSQL Used Connections:", err.message);
  } finally {
    await client.end();
  }
}

module.exports = {
  getPostgresUsedConnections,
  getPostgresVersionNumberAsJson,
  getPostgresMaxConnections,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "development" ? false : true;
}
