import { BadRequestException, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entity/user.entity';
import { UsersModule } from './user/users.module';
import { QueryFailedErrorFilter } from './exception/filter/mysql-exception.filter';
import { GraphQLError } from 'graphql';
import { GraphQLErrorException } from './exception/GraphqlErrorException';
import { GraphqlErrorResponseCode } from './exception/GraphlErrorResponseCode';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'logistic-manager',
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      formatError: (e: GraphQLError) => {
        const originalError = e.originalError;
        if (originalError instanceof GraphQLErrorException) {
          return { code: originalError.code, message: originalError.message };
        }
        if (originalError instanceof BadRequestException) {
          return {
            code: GraphqlErrorResponseCode.BAD_REQUEST,
            message: (originalError.getResponse() as any).message,
          };
        }
      },
    }),
    UsersModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: QueryFailedErrorFilter,
    },
  ],
})
export class AppModule {}
