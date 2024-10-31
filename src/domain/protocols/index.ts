export interface IAuthUseCase {
  auth?(email: string, password: string): Promise<string | null | void>
}
