export interface ApiResponse<T> {
  data: T
  meta: {
    timestamp: string
    [key: string]: unknown
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    timestamp: string
    total: number
    page: number
    pageSize: number
    hasMore: boolean
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
