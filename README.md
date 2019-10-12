# Smart compost monitoring

This repository provides a Micropython code to send data from the ESP8266 using Sigfox network and a nodejs application to show results.

```
├── arduino             <-- Arduino script to send data from ESP8266
├── micropython         <-- Micropython script to send data from ESP8266
├── templates           <-- Frontend html template
├── create_table.js     <-- Initialize postgresql table
├── docker-compose.yml  <-- Create postgresql database for dev environment
├── index.js            <-- Backend entrypoint
├── package.json
├── package-lock.json
├── Procfile
└── README.md
```

## Demo

The application has been deployed in a [heroku dynamo](http://temp-sigfox.herokuapp.com/).

## Installation

For development environments:

* Create postgresql database using docker

```
docker-compose up
```

* Install nodejs dependencies:

```
npm install
```

* Create postgresql table:

```
node create_table.js
```

## Usage 

* Launch backend application:

```
node index.js
```

* Once the backend application is running, data can be inserted to the database by using http GET requests:

```
curl https://temp-sigfox.herokuapp.com/insert?token=secret_token&seconds=1567299954&data=2680
```
