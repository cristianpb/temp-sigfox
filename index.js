const express = require('express')
const { Client } = require('pg')
const app = express()
const PORT = process.env.PORT || 3000


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

app.get('/hello', async (req, res) => res.send("Hello world"))


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
