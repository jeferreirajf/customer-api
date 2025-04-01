import { ApiProperty } from '@nestjs/swagger';

export class FindCustomerResponse {
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
