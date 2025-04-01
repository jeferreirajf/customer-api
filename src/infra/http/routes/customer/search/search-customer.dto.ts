import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Min, MinLength } from 'class-validator';

export class SearchCustomerFilters {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Search keyword',
    example: 'doe',
  })
  @IsString()
  @MinLength(1)
  keyword: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => {
    const stringValue = String(value);
    return parseInt(stringValue);
  })
  @Min(1)
  page?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => {
    const stringValue = String(value);
    return parseInt(stringValue);
  })
  @Min(1)
  size?: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Last ID of the current page',
    example: '40b1785c-6e5c-433f-9610-63defef86f5b',
  })
  @IsOptional()
  @IsString()
  lastId?: string;
}

export class CustomerDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 'e5a03e19-73a7-4d00-a247-30870be7929a',
  })
  id: string;
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  name: string;
  @ApiProperty({
    description: 'Customer email',
    example: 'john@doe.com',
  })
  email: string;
  @ApiProperty({
    description: 'Customer document',
    example: '12345678900',
  })
  document: string;
  @ApiProperty({
    description: 'Customer creation date',
    example: '2023-10-01T00:00:00.000Z',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'Customer last update date',
    example: '2023-10-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class SearchCustomerResponse {
  @ApiProperty({
    description: 'List of customers',
    type: [CustomerDto],
  })
  items: CustomerDto[];

  @ApiProperty({
    description: 'Total number of customers found',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  size: number;

  @ApiProperty({
    description: 'Next page number',
    example: 2,
  })
  next: number | null;

  @ApiProperty({
    description: 'Previous page number',
    example: null,
  })
  prev: number | null;

  @ApiProperty({
    description: 'Last ID of the current page',
    example: '40b1785c-6e5c-433f-9610-63defef86f5b',
  })
  lastId: string | null;
}
