// in the index.js file
require('dotenv').config()
const express = require('express')
const app = express()
const port =  process.env.PORT ||5054
const Gun = require('gun')

app.use(Gun.serve)

const server = app.listen(port, () => {
  console.log(`Gun server running on port ${port}🔥`)
})

const gun=Gun({file: "src/db/data.json", web: server,radisk: false, localStorage: true })
gun.opt({ file: 'gun_data' });
