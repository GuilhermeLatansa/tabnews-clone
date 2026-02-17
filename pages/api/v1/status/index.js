import database from "/infra/database.js";
const { getPostgresVersionNumberAsJson } = require("/infra/database.js");
const { getPostgresMaxConnections } = require("/infra/database.js");
const { getPostgresUsedConnections } = require("/infra/database.js");

async function status(request, response) {
  const aespa = "Black Mamba";
  const updatedAt = new Date().toISOString();
  const postgresVersion = await getPostgresVersionNumberAsJson();
  const maxConnections = await getPostgresMaxConnections();
  const usedConnections = await getPostgresUsedConnections();

  response.status(200).json({
    aespa_goated: aespa,
    updated_at: updatedAt,
    postgres_version: postgresVersion,
    max_connections: parseInt(maxConnections),
    used_connections: usedConnections,
  });
}

export default status;
