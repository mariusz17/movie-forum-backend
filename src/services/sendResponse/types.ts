export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  errorMessage?: string;
  data?: T;
};
