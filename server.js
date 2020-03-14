const express = require('express')
const bodyParser = require('body-parser')

const { router: userRouter } = require('./src/routers/user')
const { router: swaggerRouter} = require('./src/routers/swagger')

const PORT = process.env.PORT || 3000

const app = express();

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(swaggerRouter);
app.use('/api/v1', userRouter);

app.listen(PORT, () => console.log('Server ready...'));
module.exports = app;

