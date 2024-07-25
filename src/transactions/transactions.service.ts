import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { CurrencyEnum, StatusEnum, TransactionEnum } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionFilterDto } from './dto/transaction-filter.dto';
import { PaginationDto } from './dto/paginate.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getUserTransactions(
    queries: TransactionFilterDto,
    { currentPage = 1, pageLimit = 10 }: PaginationDto,
  ) {
    try {
      const transaction = await this.prisma.transaction.findMany({
        where: {
          date: {
            gte: queries?.start_date
              ? new Date(queries?.start_date)
              : undefined,
            lte: queries?.end_date ? new Date(queries?.end_date) : undefined,
          },
          status:
            queries?.status && queries?.status.length > 0
              ? { in: queries?.status }
              : undefined,
          amount: {
            gte: queries?.minimum_amount
              ? Number(queries?.minimum_amount)
              : undefined,
            lte: queries?.maximum_amount
              ? Number(queries?.maximum_amount)
              : undefined,
          },
          type:
            queries?.type && queries?.type.length > 0
              ? { in: queries?.type }
              : undefined,
          first_name: queries?.search
            ? { contains: queries?.search, mode: 'insensitive' }
            : undefined,
          currency:
            queries?.currency && queries?.currency.length > 0
              ? { in: queries?.currency }
              : undefined,
        },
      });

      console.log(transaction.length);

      const metaData = this.paginate(
        transaction.length,
        Number(currentPage),
        Number(pageLimit),
      );

      console.log(metaData);

      return {
        status: HttpStatus.OK,
        message: 'User transactions fetched successfully',
        data: transaction,
        meta: metaData,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Unable to fetch assets');
      }
      throw error;
    }
  }

  paginate(total: number, page: number, limit: number) {
    console.log(page);
    console.log(limit);
    limit = Number(limit);
    let currentPage = page ? Number(page) : 1;
    let next_page = currentPage + 1;
    const prev_page = currentPage > 1 ? currentPage - 1 : currentPage;
    const total_pages = Math.ceil(total / limit);
    if (next_page > total_pages) next_page = total_pages;
    const offset = currentPage === 1 ? 0 : (currentPage - 1) * limit;

    return {
      offset,
      limit,
      current_page: currentPage,
      next_page,
      prev_page,
      total_pages,
      total,
    };
  }
}
