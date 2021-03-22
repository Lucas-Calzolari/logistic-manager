export class GraphQLErrorException extends Error {
  code: number;
  message: string;

  constructor(error: { code?: number; message?: string }) {
    super();
    this.code = error.code;
    this.message = error.message;
  }
}
