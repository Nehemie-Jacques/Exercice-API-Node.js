import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/route.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});