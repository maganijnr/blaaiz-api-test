import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CurrencyEnum, StatusEnum, TransactionEnum } from '@prisma/client';
import { TransactionFilterDto } from './dto/transaction-filter.dto';
import { PaginationDto } from './dto/paginate.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Get('/user-transactions')
  async getAllTransactions(
    @Query()
    queries: {
      start_date?: string;
      end_date?: string;
      search?: string;
      minimum_amount?: number;
      maximum_amount?: number;
      status?: string;
      currency?: CurrencyEnum;
      type?: string;
      currentPage: number;
      pageLimit: number;
    },
  ) {
    //@ts-ignore
    const statusArray: StatusEnum[] =
      queries?.status && queries?.status?.split(',').length !== 0
        ? queries?.status?.split(',')
        : [];

    //@ts-ignore
    const typeArray: TransactionEnum[] =
      queries?.type && queries?.type?.split(',').length !== 0
        ? queries?.type?.split(',')
        : [];

    //@ts-ignore
    const currencyArray: CurrencyEnum[] =
      queries?.currency && queries?.currency?.split(',').length !== 0
        ? queries?.currency?.split(',')
        : [];

    const filterData: TransactionFilterDto = {
      ...queries,
      status: statusArray,
      type: typeArray,
      currency: currencyArray,
    };

    const pagination: PaginationDto = {
      currentPage: queries.currentPage
        ? Number(queries.currentPage)
        : undefined,
      pageLimit: queries?.pageLimit ? Number(queries.pageLimit) : undefined,
    };
    return this.transactionService.getUserTransactions(filterData, pagination);
  }
}
