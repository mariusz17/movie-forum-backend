import en from '../errorMessages/en';
import pl from '../errorMessages/pl';

import { ErrorMessagesKeys } from '../errorMessages/types';

export const getErrorText =
  (language: string) => (errorKey: ErrorMessagesKeys) => {
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
