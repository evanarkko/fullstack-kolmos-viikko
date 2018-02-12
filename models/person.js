const mongoose = require('mongoose')
const url = 'mongodb://lordevan7:yu6uahea@ds229438.mlab.com:29438/miller_phonebook'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person