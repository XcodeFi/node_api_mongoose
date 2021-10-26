import Tag from '@/models/tags.model';
import { ArrayMaxSize, ArrayMinSize, IsInt, IsNumber, isString, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { PaginationQuery } from './pagination.dto';

export class CreateBlogDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  description: string;

  @IsString()
  @MaxLength(50000)
  text: string;

  @IsString()
  @MaxLength(200)
  blogUrl: string;

  @IsString()
  @MaxLength(200)
  imgUrl: string;

  @IsInt()
  @Min(0)
  @Max(1)
  score?: number;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @MinLength(3, { each: true, message: 'Tag is too short. Minimal length is $value characters' })
  @MaxLength(50, { each: true, message: 'Tag is too long. Maximal length is $value characters' })
  tags?: string[];
}

export class BlogPagination extends PaginationQuery  {
  @IsString()
  public tag?: string;
}
