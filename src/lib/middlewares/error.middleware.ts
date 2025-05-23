import { NextFunction, Request, Response } from 'express';

import { HttpException } from '../exceptions/HttpException';

const errorMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = err.status || 500;
    const message: string = err.message || 'Something went wrong';

    console.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
