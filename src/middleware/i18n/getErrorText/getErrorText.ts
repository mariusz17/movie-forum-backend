import { en, pl } from '../errorMessages/';

import { ErrorMessagesKeys } from '../errorMessages/types';

export const getErrorText =
  (language: string) =>
  (errorKey: ErrorMessagesKeys): string => {
    switch (language) {
      case 'en-GB' || 'en':
        return en[errorKey]
          ? en[errorKey]
          : `Missing translation for ${errorKey}`;
      case 'pl-PL' || 'pl':
        return pl[errorKey]
          ? pl[errorKey]
          : `Missing translation for ${errorKey}`;

      default:
        return en[errorKey]
          ? en[errorKey]
          : `Missing translation for ${errorKey}`;
    }
  };
