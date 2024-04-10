import {IsNumber, IsPositive} from "class-validator";
import {Type} from "class-transformer";

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  //@Type(() => Number)
  price: number;
}