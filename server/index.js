require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');

const port = 80;
const db = require('../database/mongoDB');
const { Mortgages } = require('../database/mongoDB/MortgageDB.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public/dist'));
app.listen(port, () => {
  console.log(`listening at ${port}`);
});
app.use('/homes/:id', express.static('public/dist'));
app.use('/loaderio-032b6383a8e9c0567661e92196f829e0/', express.static('public/dist/loaderio-032b6383a8e9c0567661e92196f829e0.txt'));

app.get('/api/homes/:id/prices', (req, res) => {
  const { id } = req.params;
  Mortgages.find({ id }, (err, data) => {
    if (err) {
      res.end(err);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
  });
});

app.post('/api/homes/prices', (req, res) => {
  if (!req.body.street) {
    return res.status(400).send('street name required');
  }
  const mortgageSave = new Mortgages(req.body);
  mortgageSave
    .save()
    .then(data => res.status(201).send(data))
    .catch(error => res.status(500).send(error));
});

app.patch('/api/homes/:id/prices', (req, res) => {
  const { id } = req.params;
  Mortgages
    .findOneAndUpdate({ id }, req.body, { new: true })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(500).send(error));
});

app.delete('/api/homes/:id/prices', (req, res) => {
  const { id } = req.params;
  Mortgages
    .deleteOne({ id })
    .then(() => res.status(200).send(`deleted id: ${id}`))
    .catch((error) => {
      res.status(400).send(`id: ${id} does not exist in database\n`, error);
    });
});
