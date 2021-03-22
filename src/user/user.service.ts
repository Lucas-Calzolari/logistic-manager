import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphqlErrorResponseCode } from 'src/exception/GraphlErrorResponseCode';
import { GraphQLErrorException } from 'src/exception/GraphqlErrorException';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entity/user.entity';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async registerUser(data: CreateUserInput): Promise<User> {
    if ((await this.userRepository.find({ email: data.email })).length) {
      throw new GraphQLErrorException({
        code: GraphqlErrorResponseCode.DUPLICATED_ENTITY,
        message: 'Email has already been used.',
      });
    }
    const user = await this.userRepository.create({
      ...data,
      password: hashSync(data.password, 10),
    });
    const userSaved = await this.userRepository.save(user);
    if (!userSaved) {
      throw new InternalServerErrorException();
    }
    return user;
  }
}
