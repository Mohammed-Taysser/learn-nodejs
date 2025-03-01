import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import serverError from './middleware/serverError.middleware';
import morgan from 'morgan';
import CONFIG from './core/config';
import compressionMiddleware from './middleware/compression.middleware';
import routeNotFound from './middleware/routeNotFound.middleware';

// Express instance
const app: Application = express();

app.enable('verbose errors');
app.use(morgan('dev'));

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// parse body params and attache them to req.body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
// parse application/json
app.use(bodyParser.json({ limit: '30mb' }));

// Make sure the body is parsed beforehand.
app.use(hpp());

// Request Limit
if (CONFIG.env === 'production') {
  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      message:
        'Too many accounts created from this IP, please try again after an 15 minutes',
    })
  );
}

// Compress all HTTP responses
app.use(compressionMiddleware);

// Serve static Files
app.use(express.static('public'));

app.listen(CONFIG.server.port, () => {
  console.log(
    `🚀 API Server listening on, :${CONFIG.server.port}/api/v1/health-check`
  );

  // mount api routes
  // app.use('/api/v1', routes);
  // 404 route not found
  app.use(routeNotFound);
  // 500 errors
  app.use(serverError);
});
