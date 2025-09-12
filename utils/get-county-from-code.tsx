import countries from 'i18n-iso-countries';

import enLocale from 'i18n-iso-countries/langs/en.json';
countries.registerLocale(enLocale);

export function getCountryNameFromCode(code: string): string {
	return countries.getName(code, 'en') || code;
}

