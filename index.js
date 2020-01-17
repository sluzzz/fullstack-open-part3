const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(
  morgan(function(tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body)
    ].join(' ');
  })
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
];

app.get('/', (req, res) => {
  res.send('<h1>test</h1>');
});

// todo fix template literals
app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${[persons.length]} people
  ${new Date()}`);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const generateID = () => {
  return Math.floor(Math.random() * 10000000000);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    });
  } else if (
    persons.find(
      person => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateID()
  };

  persons = persons.concat(person);

  response.json(body);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
