import { IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  public name: string;
}
