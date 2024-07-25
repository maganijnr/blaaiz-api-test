import { IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  currentPage: number;

  @IsNumber()
  pageLimit: number;
}
