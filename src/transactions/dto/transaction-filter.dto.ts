import { CurrencyEnum, StatusEnum, TransactionEnum } from '@prisma/client';
import {
  IsISO8601,
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';

export class TransactionFilterDto {
  @IsOptional()
  @IsISO8601()
  start_date?: string;

  @IsOptional()
  @IsISO8601()
  end_date?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  minimum_amount?: number;

  @IsOptional()
  @IsNumber()
  maximum_amount?: number;

  @IsOptional()
  @IsEnum(StatusEnum, {
    each: true,
    message: 'Status must be either COMPLETED, PENDING, or FAILED',
  })
  @IsArray()
  status?: StatusEnum[];

  @IsOptional()
  @IsEnum(CurrencyEnum, {
    message: 'Currency must be either CAD, NGN, GBP, or KES',
  })
  currency?: CurrencyEnum[];

  @IsOptional()
  @IsEnum(TransactionEnum, {
    message:
      'Transaction must be either FAMILY ,SHOPPING ,TRANSFER ,SERVICE ,INSURANCE ,FOOD ,MUSIC or OTHERS',
  })
  @IsArray()
  type?: TransactionEnum[];
}
