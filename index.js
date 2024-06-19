import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from './routes/public-api.js';
import { web } from './application/web.js';
import { ResponseError } from './error/response-error.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter);
app.use(web); // Assuming web is a middleware or router from ./application/web.js

app.get('/', (req, res) => {
    res.send('<h1>Server is running...</h1>');
});

// Error-handling middleware for catching unhandled errors
app.use((err, req, res, next) => {
    if (err instanceof ResponseError) {
        res.status(err.status).json({ 
            error: true,
            message: err.message 
        });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, '0.0.0.0', () => 
    console.log(`listening on port ${PORT}`)
);