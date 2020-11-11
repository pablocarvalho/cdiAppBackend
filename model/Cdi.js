const mongoose = require('mongoose')

const Cdi = mongoose.Schema(
    { 
        _id: String, 
        date: Date, 
        rate: Number, 
        tcdi: Number
    });

module.exports = mongoose.model('Cdi',Cdi,'cditable');

