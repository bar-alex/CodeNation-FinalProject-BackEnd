require('dotenv').config();
const express = require('express');
const cors = require('cors');

app = express();
app.use(cors())
app.use(express.json())

app.get('/', (rec, res)=>{
    res.send("Hello World");
})

app.listen(process.env.PORT, ()=>{
    console.log('app is listening');
})
