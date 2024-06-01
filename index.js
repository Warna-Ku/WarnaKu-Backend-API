import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from './routes/public-api.js';
import { web } from './application/web.js';

const app = express();
const PORT = process.env.EXPRESS_PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter);
app.use(web); // Assuming web is a middleware or router from ./application/web.js

app.get('/', (req, res) => {
    res.status(200).send('<h1>Server is running...</h1>');
});

app.listen(PORT, '0.0.0.0', () => console.log(`listening on port ${PORT}`));
