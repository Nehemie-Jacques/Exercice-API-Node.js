import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/route.js';
import morgan from 'morgan';
import 'dotenv/config'

const app = express();
const port = 3000;
// const port = process.env.PORT || 3000;
// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

