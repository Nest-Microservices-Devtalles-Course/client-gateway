import {ArgumentsHost, Catch, ExceptionFilter, RpcExceptionFilter, UnauthorizedException} from "@nestjs/common";
import {RpcException} from "@nestjs/microservices";

@Catch(RpcException)
export class RPCCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const rpcError = exception.getError();
    if (rpcError.toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1)
      });
    }

    console.log(rpcError);

    if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
      const status = rpcError.status;
      return response.status(status).json(rpcError);
    }

    response.status(400).json({
      status: 400,
      message: rpcError
    });
  }
}