import bodyParser from 'body-parser';
import CONFIG from './core/config';
import express, { Application } from 'express';
import morgan from 'morgan';

// Express instance
const app: Application = express();

app.enable('verbose errors');
app.use(morgan('dev'));

// parse body params and attache them to req.body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
// parse application/json
app.use(bodyParser.json({ limit: '30mb' }));

app.listen(CONFIG.server.port, () => {
  console.log(
    `🚀 API Server listening on, :${CONFIG.server.port}/api/v1/health-check`
  );

  // // mount api routes
  // app.use('/api/v1', routes);
  // // 404 route not found
  // app.use(routeNotFound);
  // // 500 errors
  // app.use(serverError);
});
