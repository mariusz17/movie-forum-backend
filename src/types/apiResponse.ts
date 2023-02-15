export type ApiResponseBody<T> = {
  ok: boolean;
  status: number;
  errorMessage?: string;
  data?: T;
};
