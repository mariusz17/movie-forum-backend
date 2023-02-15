import { ErrorMessages } from './errorMessages/types';
import en from './errorMessages/en';
import pl from './errorMessages/pl';

export const t = (text: keyof ErrorMessages, lang: string): string => {
  switch (lang) {
    case 'en-GB' || 'en':
      return en[text] ? en[text] : `Missing translation for ${text}`;
    case 'pl-PL' || 'pl':
      return pl[text] ? pl[text] : `Missing translation for ${text}`;

    default:
      return en[text] ? en[text] : `Missing translation for ${text}`;
  }
};
