/* eslint-disable global-require */
/* eslint-disable no-console */
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
// import morgan from 'morgan';
import requireDir from 'require-dir';

const app: Application = express();

const ip: string = '192.168.1.2';
const port: Number = 3333;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));

mongoose.connect(`mongodb://${ip}:27017/mongo`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  requireDir('./models');

  app.use('/api', require('./routes'));
  app.listen(port, () => console.log(`Application started successfully on port ${port}.`));
});
