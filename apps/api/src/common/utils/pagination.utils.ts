// src/common/utils/pagination.utils.ts

import { NotFoundException } from "@nestjs/common"
import { paginationConfig } from "src/config/pagination.config"
import { CommonQueryParamsDto } from "../dto/paginated-query.dto"

export interface PaginateOutput<T> {
  data: T[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prevPage: number | null
    nextPage: number | null
  }
}

export const paginateOutput = <T>(
  data: T[],
  total: number,
  query: CommonQueryParamsDto
  //   page: number,
  //   limit: number,
): PaginateOutput<T> => {
  const page = query.page || paginationConfig.defaultPage
  const limit = query.limit || paginationConfig.defaultLimit

  const lastPage = Math.ceil(total / limit)

  // if data is empty, return empty array
  if (!data.length) {
    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage: limit,
        prevPage: null,
        nextPage: null,
      },
    }
  }

  // if page is greater than last page, throw an error
  if (page > lastPage) {
    throw new NotFoundException(
      `Page ${page} not found. Last page is ${lastPage}`
    )
  }

  return {
    data,
    meta: {
      total,
      lastPage,
      currentPage: page,
      perPage: limit,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < lastPage ? page + 1 : null,
    },
  }
}
