export type ErrorMessages = {
  notFound: string;
  internal: string;
  includeFields: string;
  userExists: string;
  wrongCredentials: string;
  invalidData: string;
  unauthorized: string;
  sessionExpired: string;
};

export type ErrorMessagesKeys = keyof ErrorMessages;
