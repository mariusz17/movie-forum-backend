import { en, pl } from '../errorMessages/';

import { ErrorMessagesKeys } from '../errorMessages/types';

const EN_PREFIXES = ['en', 'en-GB'];
const PL_PREFIXES = ['pl', 'pl-PL'];

export const getErrorTextTemplate =
  (language: string) =>
  (errorKey: ErrorMessagesKeys): string => {
    if (EN_PREFIXES.indexOf(language) !== -1) {
      return en[errorKey];
    }

    if (PL_PREFIXES.indexOf(language) !== -1) {
      return pl[errorKey];
    }

    return en[errorKey] ? en[errorKey] : `Missing translation for ${errorKey}`;
  };
