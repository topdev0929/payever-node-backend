import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  public catch(error: Error, host: ArgumentsHost): any {
    const status: number = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const response: any = host.switchToHttp().getResponse();
      
      return response.status(status).send(JSON.stringify(error));
    }

    throw error;
  }
}
