const express = require('express')
const { Client } = require('pg')
const app = express()
const port = 3000

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'secret_passwd',
  database: 'postgres',
})

app.get('/', async (req, res) => {
  await client.connect()
  const result = await client.query('SELECT * FROM data2')
  console.log(result.rows)
  res.status(200).send(result.rows);
  await client.end()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
