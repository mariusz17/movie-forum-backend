export type ErrorMessages = {
  internal: string;
  includeFields: string;
  userExists: string;
  wrongCredentials: string;
  invalidData: string;
};

export type ErrorMessagesKeys = keyof ErrorMessages;
