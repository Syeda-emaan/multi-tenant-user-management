const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skip: () => process.env.NODE_ENV === 'test',
  message: { success: false, message: 'Too many attempts, try again later' },
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(YAML.load(path.join(__dirname, '..', 'docs', 'swagger.yaml'))));
app.use('/api/auth', authLimiter);
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;