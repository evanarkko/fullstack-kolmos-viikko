const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')

morgan.token('reqbody', function (req, res) { return JSON.stringify(req.body) })
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

app.use(bodyParser.json())

let persons = [
    {
        name: "Evan Miller",
        number: "0934384938",
        id: 1
    },
    {
        name: "Joseph",
        number: "093241384938",
        id: 2
    },
    {
        name: "Johannes Korpijaakko",
        number: "06634384938",
        id: 3
    }
]

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }else{
        res.sendStatus(404)
    }

})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const personCount = persons.length
    res.send(`<div>
                <p>Puhelinluettelossa ${personCount} henkilön tiedot</p>
                <p>${new Date()}</p>
              </div>`)
})

app.delete('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.sendStatus(204)
})

const generateId = () => {
    //const maxId = persons.length > 0 ? persons.map(p => p.id).sort().reverse()[0] : 1
    //return maxId + 1
    return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (req, res) => {//add a prs
    const body = req.body
    if(body.name === undefined || body.number === undefined){
        return res.status(400).json({error: 'content missing'})
    }
    if(persons.find(person => person.name === body.name)){
        return res.status(400).json({error: 'Name already exists'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`)
})