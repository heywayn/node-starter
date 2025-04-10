import { Router } from 'express';

import UsersController from '@/conrollers/users.controllers';
import { Routes } from '@/interfaces/routes.interface';

class UsersRoute implements Routes {
  public path = '/users';

  public router = Router();

  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
  }
}

export default UsersRoute;
