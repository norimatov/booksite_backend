import { IsUUID, IsNumber, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsUUID()
  bookId: string;

  @IsNumber()
  @Min(0)
  currentPage: number;

  @IsNumber()
  @Min(0)
  sessionMinutesDelta: number; // shu so'rovdan beri o'qilgan qo'shimcha daqiqa
}
