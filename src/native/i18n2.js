import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// import LanguageDetector from 'i18next-browser-languagedetector';
import { FirebaseRef } from '../lib/firebase';

export default new Promise(resolve => FirebaseRef.child('translations')
  .on('value', (snapshot) => {
    const resources = snapshot.val() || {};

    //  console.log(resources);

    //  let lng;
    //  console.log(localStorage.getItem('language'));
    //  if (localStorage.getItem('language') && localStorage.getItem('language') !== null && localStorage.getItem('language') !== undefined) {
    //  //  console.log(localStorage.getItem('language'));
    //    lng = localStorage.getItem('language');
    //  } else {
    //    lng = 'lv';
    //  }

    i18n
    //  .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'lv',
        debug: true,
        detection: {
          order: ['cookie', 'localStorage'],

          // keys or params to lookup language from
          lookupQuerystring: 'lng',
          lookupCookie: 'i18next',
          lookupLocalStorage: 'i18nextLng',
          lookupFromPathIndex: 0,
          lookupFromSubdomainIndex: 0,

        },

        interpolation: {
          escapeValue: false,
        },
        lng: 'lv',
        resources,
      });

    return resolve(i18n);
  }));


// export default i18n;
