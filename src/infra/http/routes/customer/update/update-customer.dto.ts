import { CustomerType } from '@/usecase/customer/create/create-customer.usecase';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCustomerRequest {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer email',
    example: 'john@doe.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer document with no mask',
    example: '12345678900',
  })
  @IsString()
  @MinLength(11)
  @MaxLength(14)
  document: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer type',
    example: 'individual',
    enum: CustomerType,
  })
  @IsEnum(CustomerType)
  customerType: CustomerType;
}

export class UpdateCustomerResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Customer ID',
    example: '6161b33f-a400-4db4-b3a6-4cca7c00867f',
  })
  id: string;
}
