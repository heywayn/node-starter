import { User } from '@/interfaces/users.interface';
import { HttpException } from '@/lib/exceptions/HttpException';
import userModel from '@/models/user.model';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();

    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (!userId) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    return findUser;
  }
}

export default UserService;
