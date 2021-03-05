//const devMode = (process.env.NODE_ENV === 'development');
const devMode = (window && window.location) ? (window.location.hostname.includes("localhost") || window.location.hostname.includes("dev.spelezoli"))  : (process.env.NODE_ENV === 'development');

export default {
  // App Details
  appName: 'Zole',

  // Build Configuration - eg. Debug or Release?
  DEV: devMode,

  // Google Analytics - uses a 'dev' account while we're testing
  gaTrackingId: (devMode) ? 'UA-84284256-2' : 'UA-84284256-1',

  // Is in APP frame
  isInAppFrame: function(){
    return (window && (window.location.hostname == 'dra.spelezoli.lv' || window.location.hostname == 'fb.spelezoli.lv' || window.location.hostname == 'fb.dev.spelezoli.lv' || window.location.hostname == 'dra.dev.spelezoli.lv'));
  },

  stripeBublicKey: devMode ? "pk_test_51Gs5SYBMkkbrbQPOLQPI6BSiEyASrlxDuOtjxuoGR4FD4uvTrouCcDltpGf6WzHOV7umcJF6V11uFb9KSC6nrEhp00ER6Vvbjw" : "pk_live_8m4yl5pHi01PuUXNh18Z9KFc00P5D2wK4a"
};
