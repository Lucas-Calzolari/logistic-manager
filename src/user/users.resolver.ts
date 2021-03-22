import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async registerUser(@Args('data') data: CreateUserInput): Promise<User> {
    const user = await this.userService.registerUser(data);
    return user;
  }

  @Query(() => Boolean)
  async teste(): Promise<boolean> {
    return true;
  }
}
