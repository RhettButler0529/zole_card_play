import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-firebase-backend';
// import { FirebaseRef } from '../lib/firebase';


// export default new Promise(resolve => FirebaseRef.child('translations')
//  .once('value', (snapshot) => {
//    const resources = snapshot.val() || {};

//    console.log(resources);

/*
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb => cb('en'),
  init: () => {},
  cacheUserLanguage: () => {},
};

*/

export default new Promise((resolve) => {
  i18n
  //  .use(languageDetector)
    .use(XHR)
    .use(initReactI18next)
    .init({
      fallbackLng: 'lv',
      debug: true,

      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/translations/{{lng}}',
      },
      lng: 'lv',
    //  resources,
    });

  //    return resolve(i18n);
  //  }));

  return resolve(i18n);
});


// export default i18n;
