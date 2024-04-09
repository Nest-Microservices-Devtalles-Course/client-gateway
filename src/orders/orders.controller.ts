import {Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query} from '@nestjs/common';
import {CreateOrderDto, OrderPaginationDto, StatusDto} from './dto';
import {ORDER_SERVICE} from "../config";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {catchError} from "rxjs";
import {PaginationDto} from "../common";

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy
  ) {
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    console.log("client gateway", orderPaginationDto);
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }

  @Get('/id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', {id})
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
      return this.ordersClient.send('findAllOrders', {
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
      return this.ordersClient.send('changeOrderStatus', {id, status: statusDto.status});
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
