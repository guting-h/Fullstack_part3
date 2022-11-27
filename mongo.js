const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://notes-app-full:${password}@cluster1.lvvbt.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)

if (process.argv.length === 2) {
    Note.find({}).then(result => {
        result.forEach(note => {
          console.log(note)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    mongoose
        .connect(url)
        .then((result) => {
            console.log('connected')

            const note = new Note({
                name: proc
            })

            return note.save()
        })
        .then(() => {
            console.log('note saved!')
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}
