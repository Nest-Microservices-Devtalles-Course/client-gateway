import {Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query} from '@nestjs/common';
import {CreateOrderDto, OrderPaginationDto, StatusDto} from './dto';
import {NATS_SERVICE} from "../config";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {catchError, firstValueFrom} from "rxjs";
import {PaginationDto} from "../common";

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(
        this.client.send('findAllOrders', orderPaginationDto)
      );

      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('/id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder', {id})
      .pipe(catchError(error => {
        throw new RpcException(error);
      }));
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    try {
      return this.client.send('changeOrderStatus', {id, status: statusDto.status});
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
