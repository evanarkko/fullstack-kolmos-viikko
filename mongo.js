const mongoose = require('mongoose')

const url = 'mongodb://lordevan7:yu6uahea@ds229438.mlab.com:29438/miller_phonebook'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})


const args = process.argv.slice(2);
if (args[0]) {
    const person = new Person({
        name: args[0],
        number: args[1] || '0000000'
    })


    person
        .save()
        .then(response => {
            console.log(`lisättiin ${args[0]} ${args[1]} luetteloon`)
            mongoose.connection.close()
        })
} else {
    console.log('puhelinluettlo:')
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}
