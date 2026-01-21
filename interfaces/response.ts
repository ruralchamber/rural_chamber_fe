export interface CustomResponse<T> {
    status: number;
    data: T;
    message: string;
    error: boolean | string;
    success: boolean
}
  
