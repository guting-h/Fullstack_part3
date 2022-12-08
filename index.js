require('dotenv').config()
const express = require('express')
require('mongoose')
const app = express()
const Person = require('./models/person')

// 3.7 added the morgan middleware
var morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
// 3.8 configure custom format for morgan
morgan.token('data', function (req) { return JSON.stringify(req.body) })
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['data'](req, res)
    ].join(' ')
  })
)
app.use(cors())

// 3.1 get all the contacts in the phonebook
app.get('/api/persons', (request, response) => {
  Person.find({}).then(contacts => {
    response.json(contacts)
  })
})

// 3.2 display info about the phonebook and the request sent
app.get('/info', (request, response) => {
  Person.find({}).then(contacts => {
    response.send(
      `<p>
          Phonebook has info for ${contacts.length} people <br> 
          Request received on ${new Date()} 
      </p>`
    )
  })
})

// 3.3 display information of a single phonebook entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

// 3.4 delete a single phonebook entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 3.5 & 3.6 adding new phonebook entries
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

// 3.17 update phonebook entry when name already exist
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})