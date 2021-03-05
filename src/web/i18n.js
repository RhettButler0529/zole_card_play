import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
// import { FirebaseRef } from '../lib/firebase';

// import resources2 from '../constants/translations/resources';

import lvTranslations from '../constants/translations/lv';
import ruTranslations from '../constants/translations/ru';
import enTranslations from '../constants/translations/en';

// export default new Promise(resolve => FirebaseRef.child('translations')
//  .on('value', (snapshot) => {
//    const resources = snapshot.val() || [];

//    console.log(resources);

//  console.log(resources2);

let lng = 'lv';
try {
  if (localStorage && localStorage.getItem('language') && localStorage.getItem('language') !== null && localStorage.getItem('language') !== undefined) {
  //  console.log('localStorage');
    lng = localStorage.getItem('language');
  } else {
    lng = 'lv';
  }
} catch(err) {
  lng = 'lv';
}

// console.log('lng');
// console.log(lng);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'lv',
    debug: false,
    detection: {
      order: ['localStorage'],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
    lng,
    resources: {
      lv: lvTranslations,
      ru: ruTranslations,
      en: enTranslations,
    },
  });

//  return resolve(i18n);
// }));


export default i18n;
