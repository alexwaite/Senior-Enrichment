const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const { syncAndSeed, Student, Campus } = require('./server/db');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

app.get('/app.js', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'dist', 'main.js'))
);

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

syncAndSeed().then(() =>
  app.listen(port, () => console.log(`listening on port ${port}`))
);

app.get('/api/students', (req, res, next) => {
  Student.findAll()
    .then(students => res.send(students))
    .catch(next);
});

app.get('/api/campuses', (req, res, next) => {
  Campus.findAll()
    .then(campuses => res.send(campuses))
    .catch(next);
});

app.post('/api/campuses', (req, res, next) => {
  Campus.create(req.body)
    .then(campus => res.send(campus))
    .catch(next);
});

app.post('/api/students', (req, res, next) => {
  Student.create(req.body)
    .then(student => res.send(student))
    .catch(next);
});

app.delete('/api/students/:id', (req, res, next) => {
  Student.destroy({ where: { id: req.params.id } })
    .then(res.sendStatus(202))
    .catch(next);
});

app.delete('/api/campuses/:id', (req, res, next) => {
  Campus.destroy({ where: { id: req.params.id } })
    .then(res.sendStatus(202))
    .catch(next);
});
