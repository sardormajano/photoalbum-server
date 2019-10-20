const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send('this is a root route'));
app.use('/users', routes.users);
app.use('/photos', routes.photos);

app.listen(3001);
