import express from 'express';
import bodyParser from 'body-parser';
import contactroutes from './routes/route.js';
import 'dotenv/config';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/', contactroutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})