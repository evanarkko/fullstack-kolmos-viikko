const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const formatPerson = (person) => {
    const formattedPerson = {...person._doc, id: person._id}
    delete formattedPerson._id
    delete formattedPerson.__v

    return formattedPerson
}


app.use(express.static('build'))
morgan.token('reqbody', function (req, res) {
    return JSON.stringify(req.body)
})
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens['reqbody'](req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ')
    })
)
app.use(cors())
app.use(bodyParser.json())


app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(formatPerson(person))
        })

})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(formatPerson))
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            const personCount = persons.length
            console.log(personCount)
            res.send(`<div>
                <p>Puhelinluettelossa ${personCount} henkilön tiedot</p>
                <p>${new Date()}</p>
              </div>`)
        })

    /*const personCount = persons.length
    res.send(`<div>
                <p>Puhelinluettelossa ${personCount} henkilön tiedot</p>
                <p>${new Date()}</p>
              </div>`)*/
})

app.delete('/api/persons/:id', (req, res) => {
    Person.remove({_id: req.params.id})
        .then(() => {
            res.sendStatus(204)
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    console.log(req.body)
    console.log(req.params.id)

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    Person
        .findById(req.params.id)
        .then(person => {
            person.number = body.number
            console.log(person)
            person.save()
                .then(() => {
                    res.sendStatus(200)
                })
        })

})


app.post('/api/persons', (req, res) => {//add a prs
    const body = req.body
    console.log(body)
    if (body === undefined) {
        return res.status(400).json({error: 'content missing'})
    }

    Person
        .find({name: body.name})
        .then(persons => {
            if (persons.length > 0) {
                res.sendStatus(403) //forbidden if person is in db already
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number
                })
                person
                    .save()
                    .then(savedPerson => {
                        res.json(formatPerson(savedPerson))
                    })
            }
        })


})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`)
})