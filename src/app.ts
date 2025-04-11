import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connect } from 'mongoose';

import config from './config';
import { Routes } from './interfaces/routes.interface';
import { errorMiddleware, rateLimitMiddleware } from './lib/middlewares';

const { port, mongoConnectionUrl } = config;

class App {
  public app: express.Application;

  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = port;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log('==============================');
      console.log(`App listening on the port ${this.port}`);
      console.log('==============================');
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      const conn = await connect(mongoConnectionUrl);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  private initializeMiddlewares() {
    this.app.use(rateLimitMiddleware);

    this.app.use(helmet());
    this.app.use(
      cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', credentials: true })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
