const { Client } = require('pg')
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:secret_passwd@localhost:5432/postgres"

async function exec_query(query) {
  let client = new Client({connectionString: DATABASE_URL})
  try {
    await client.connect()
    const result = await client.query(query)
    console.log(result.command)
    console.log(result.rows)
    await client.end()
  } catch (e) {
    console.log(e.code);
    console.log(e.detail);
    client.end()
  }
}

query = `
  CREATE TABLE IF NOT EXISTS data (
    seconds BIGINT PRIMARY KEY,
    temperature DECIMAL(4,2),
    humidity DECIMAL(4,2)
  );
`
exec_query(query);

query = `
  INSERT INTO data values(1567276912, 27.60, 51.30);
  INSERT INTO data values(1567277680, 27.50, 51.30);
  INSERT INTO data values(1567278449, 27.60, 51.30);
  INSERT INTO data values(1567279217, 27.60, 51.20);
  INSERT INTO data values(1567279985, 27.50, 50.70);
  INSERT INTO data values(1567280752, 27.50, 50.50);
  INSERT INTO data values(1567281520, 27.50, 50.10);
  INSERT INTO data values(1567282287, 27.30, 49.60);
  INSERT INTO data values(1567283056, 27.20, 48.30);
  INSERT INTO data values(1567283823, 27.20, 48.10);
  INSERT INTO data values(1567284591, 27.10, 47.70);
  INSERT INTO data values(1567285359, 27.10, 47.40);
  INSERT INTO data values(1567286126, 27.00, 47.20);
  INSERT INTO data values(1567286894, 26.90, 47.00);
  INSERT INTO data values(1567287662, 26.90, 46.90);
  INSERT INTO data values(1567288429, 26.80, 47.20);
  INSERT INTO data values(1567289198, 26.90, 47.60);
  INSERT INTO data values(1567289966, 27.00, 47.60);
  INSERT INTO data values(1567290733, 27.00, 47.60);
  INSERT INTO data values(1567291501, 27.00, 48.00);
  INSERT INTO data values(1567292269, 26.80, 47.70);
  INSERT INTO data values(1567293038, 26.90, 48.80);
  INSERT INTO data values(1567293806, 26.90, 49.60);
  INSERT INTO data values(1567294575, 26.90, 49.70);
  INSERT INTO data values(1567295342, 26.80, 50.20);
  INSERT INTO data values(1567296110, 26.80, 50.70);
  INSERT INTO data values(1567296880, 26.80, 50.80);
  INSERT INTO data values(1567297648, 26.70, 50.90);
  INSERT INTO data values(1567298417, 26.70, 51.10);
  INSERT INTO data values(1567299185, 26.80, 51.50);
  INSERT INTO data values(1567299954, 26.80, 51.90);
`
exec_query(query);
