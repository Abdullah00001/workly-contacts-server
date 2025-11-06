import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { morganMessageFormat, streamConfig } from '@/configs/morgan.configs';
import corsConfiguration from '@/configs/cors.configs';
import { globalErrorMiddleware } from '@/middlewares/globalError.middleware';
import cookieParser from 'cookie-parser';
import v1Routes from '@/routes/v1';
import { baseUrl } from '@/const';
import userAgent from 'express-useragent';
import YAML from 'yamljs';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import path from 'path';
import '@/jobs/index';
import '@/queue/index';
import passport from 'passport';
import '@/configs/googleStrategy.config';
import helmet from 'helmet';

const app: Application = express();
const swaggerDocumentPath = path.resolve(__dirname, '../swagger.yaml');
const swaggerDocument: JsonObject = YAML.load(
  swaggerDocumentPath
) as JsonObject;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(cors(corsConfiguration));
app.use(userAgent.express());
app.use(
  morgan(morganMessageFormat, {
    stream: {
      write: (message: string) => streamConfig(message),
    },
  })
);
app.use(helmet());
app.use(passport.initialize());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server Is Running' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* ====================================|
|--------------APP ROUTES--------------|
|==================================== */

// V1 ROUTES
app.use(baseUrl.v1, v1Routes);
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});
app.use(globalErrorMiddleware);

export default app;
