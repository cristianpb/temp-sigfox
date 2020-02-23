const express = require('express')
const axios = require('axios');
const { Client } = require('pg')
const convertPayload = require('./parsing.js');
const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.TOKEN || "secret_token"
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:secret_passwd@localhost:5432/postgres"
const DEVICE_ID = process.env.DEVICE_ID || "device_id"
const UNAME = process.env.UNAME || "username"
const UPASS = process.env.UPASS || "password"

app.use(express.static(__dirname + '/templates'));

app.get('/api/data', async (req, res) => {
  let query = 'SELECT * FROM data ';
  const start = req.query.start;
  const end = req.query.end;
  const limit = req.query.limit;
  if (start && end) {
    query += ` WHERE seconds BETWEEN ${start} and ${end}`;
  }
  query += ` ORDER BY seconds DESC LIMIT ${limit? limit: 1000}`;
  console.log(query);
  let client = new Client({connectionString: DATABASE_URL})
  await client.connect()
  const result = await client.query(query)
  console.log(result.rows)
  await client.end()
  res.status(200).send(result.rows);
})

app.get('/api/insert', async (req, res) => {
  const req_token = req.query.token
  const seconds = req.query.seconds
  const data = req.query.data

  const temperature = Number(data.substr(0,2) + '.' + data.substr(2,2))
  const humidity = Number(data.substr(4,2) + '.' + data.substr(6,2))

  if (req_token === TOKEN) {
    try {
      let client = new Client({connectionString: DATABASE_URL})
      await client.connect()
      const result = await client.query('INSERT INTO data VALUES($1, $2, $3) RETURNING *', [seconds, temperature, humidity])
      await client.end()
      res.status(200).send(result.rows);
    } catch (err) {
      console.log(err)
    }
  } else {
    res.status(400).send("Bad token");
  }
})

app.get('/api/sensor', async (req, res) => {
  const limit = req.query.limit;
  const start = req.query.start;
  const end = req.query.end;
  const params = {}
  if (limit) {
    params.limit = limit
  }
  if (start) {
    params.since = start
  }
  if (end) {
    params.before = end
  }
  const myurl = `https://api.sigfox.com/v2/devices/${DEVICE_ID}/messages`
  const resulting = await axios.get(myurl, {
    params: params,
    auth: {
      username: UNAME,
      password: UPASS
    }
  });
  const result = resulting.data.data.map((item) => {
    let convertedPayload = convertPayload(item.data) 
    convertedPayload['time'] = item.time;
    return convertedPayload
  });
  try {
    res.status(200).send(result);
  } catch (err) {
    console.log(err)
  }
})

app.get('/api/healthcheck', (req, res) => res.send("OK"))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
