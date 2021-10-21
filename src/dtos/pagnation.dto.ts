import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationQuery {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  public limit?: number;

  @IsNumber()
  @IsOptional()
  public offset?: number;
}
