const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cdi = require('./model/Cdi');


require('dotenv/config')


app.use(bodyParser.json());

//Routes
app.get('/',(req,res) => {
    res.send("Hello World!");
});

app.get('/com',(req,res) => {
    res.send("compressed route");
});



app.post('/unc', async (req,res) => {
    
    iDate = req.body.investmentDate;
    cDate = req.body.currentDate;
    cdbRate = req.body.cdbRate;

    const allentries = await Cdi.find( {date : { $gte:new Date(iDate), $lt:new Date(cDate) }})
    res.json(allentries);   
   
});

mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true },
    () => console.log('connected to db!')
);

app.get('/unc', async (req,res) => {
    try{
        const allentries = await Cdi.find();
        res.json(allentries);
        console.log(allentries);
    }catch(err){
        res.json({message:err});
    }
});

app.listen(3000);


