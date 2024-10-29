export type HttpResponse = {
  statusCode: number
  body?: unknown
}

export type HttpRequest = {
  body?: {
    email?: string
    password?: string
  }
}
