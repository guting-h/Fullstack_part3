const express = require('express')
const app = express()

app.use(express.json())

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// 3.1 get all the contacts in the phonebook
app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

// 3.2 display info about the phonebook and the request sent
app.get('/info', (request, response) => {
    response.send(
        `<p>
            Phonebook has info for ${Object.keys(contacts).length} people <br> 
            Request received on ${new Date()} 
        </p>`
    )
})

// 3.3 display information of a single phonebook entry
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(person => person.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

// 3.4 delete a single phonebook entry
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(person => person.id !== id)
    response.status(204).end()
})

// 3.5 & 3.6 adding new phonebook entries
app.post('/api/persons', (request, response) => {
    const body = request.body
    const names = contacts.map(person => person.name)

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
    } else if (names.includes(body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000),
    }
    
    contacts = contacts.concat(person)
    
    response.json(contacts)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})