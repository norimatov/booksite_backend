import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsEnum } from 'class-validator';
import { BookFormat } from '../book.entity';

export class CreateBookDto {
  @IsString() title: string;
  @IsString() author: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() coverUrl?: string;
  @IsOptional() @IsString() contentUrl?: string;
  @IsOptional() @IsString() audioUrl?: string;
  @IsOptional() @IsEnum(BookFormat) format?: BookFormat;
  @IsOptional() @IsNumber() totalPages?: number;
  @IsOptional() @IsBoolean() isPremiumOnly?: boolean;
  @IsOptional() @IsString() language?: string;
  @IsOptional() @IsNumber() publishedYear?: number;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsBoolean() deliveryAvailable?: boolean;
  @IsOptional() @IsArray() categoryIds?: string[];
}
