import { IsOptional, IsString, IsNumberString, IsBooleanString } from 'class-validator';

export class QueryBooksDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsBooleanString() premiumOnly?: string;
  @IsOptional() @IsNumberString() page?: string;
  @IsOptional() @IsNumberString() limit?: string;
  @IsOptional() @IsString() sort?: 'newest' | 'popular' | 'rating';
}
