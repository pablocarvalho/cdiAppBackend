const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cdi = require('./model/Cdi');
const Decimal = require('decimal.js')


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

    accumTcdi = new Decimal(1.0);
    answer = [];    
    
    for(var i = allentries.length - 1; i >= 0 ; i--){
        console.log(allentries[i].tcdi);
        accumTcdi = new Decimal(accumTcdi.times(1+allentries[i].tcdi*(cdbRate/100)).toFixed(16, Decimal.ROUND_FLOOR));
        
        unitPrice = 1000 * accumTcdi.toFixed(8)
        console.log(accumTcdi);
        answer.push({
            "date" : allentries[i].date.getFullYear()+'-' + (allentries[i].date.getMonth()+1) + '-'+allentries[i].date.getDate(),
            "unitPrice" : unitPrice
        });
    }

    res.json(answer);   
   
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


