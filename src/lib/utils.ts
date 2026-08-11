export function paginate(page?: number, pageSize?: number) {
  const p = Math.max(1, page ?? 1)
  const ps = Math.min(100, Math.max(1, pageSize ?? 20))
  return {
    skip: (p - 1) * ps,
    take: ps,
    page: p,
    pageSize: ps,
  }
}

export function success<T>(data: T, meta?: Record<string, unknown>) {
  return { data, meta: { timestamp: new Date().toISOString(), ...meta } }
}

export function errorResponse(code: string, message: string, details?: unknown) {
  return { error: { code, message, ...(details ? { details } : {}) } }
}
