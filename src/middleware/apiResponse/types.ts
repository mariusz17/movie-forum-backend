export type ApiResponseBody<T> = {
  ok: boolean;
  status: number;
  data?: T;
  errorMessage?: string;
};

export type SendApiResponse = <T>(body: ApiResponseBody<T>) => void;
