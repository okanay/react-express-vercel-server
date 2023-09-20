import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import login from "./login"

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({
    message: 'server is active on vercel!',
  });
});

app.use('/login', login);

export default app;
