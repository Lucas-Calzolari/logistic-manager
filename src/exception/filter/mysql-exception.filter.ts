import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { GraphqlErrorResponseCode } from '../GraphlErrorResponseCode';
import { GraphQLErrorException } from '../GraphqlErrorException';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements GqlExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    return new GraphQLErrorException({
      code: GraphqlErrorResponseCode.DUPLICATED_ENTITY,
      message: 'Database Error',
    });
  }
}
