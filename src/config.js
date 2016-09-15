/*eslint max-len: 0*/

// This configuration is shared with the client. Any hidden, server-only config
// belongs in ./server instead.

import localStorageAvailable from 'lib/localStorageAvailable';

const reddit = process.env.REDDIT || 'https://www.reddit.com';

// NOTE: It's very important that this is the root domain and not any
// subdomain. Used for setting cookies, could cause issues like losing
// authentication or infinite redirect loops if it doesn't work.
//
// This regex pulls out the domain for many different types of urls
// For instance, the following urls have a root domain of 'reddit.com'
//   - https://reddit.com
//   - https://www.reddit.com
//   - https://www.staging.reddit.com
//
// This also allows you to set process.env.REDDIT to a localhost type url
const rootDomain = reddit.match(/^.*:\/\/(.*\.)?(.+\.\w*[^\/])/);
const rootReddit = rootDomain ? rootDomain[2] : reddit;

const config = () => ({
  https: process.env.HTTPS === 'true',
  httpsProxy: process.env.HTTPS_PROXY === 'true',

  debugLevel: process.env.DEBUG_LEVEL,
  postErrorURL: '/error',

  minifyAssets: process.env.MINIFY_ASSETS === 'true',

  assetPath: process.env.STATIC_BASE || '',

  origin: process.env.ORIGIN || 'http://localhost:4444',
  port: process.env.PORT || 4444,
  env: process.env.NODE_ENV || 'development',

  nonAuthAPIOrigin: process.env.NON_AUTH_API_ORIGIN || 'https://www.reddit.com',
  authAPIOrigin: process.env.AUTH_API_ORIGIN || 'https://oauth.reddit.com',

  reddit,
  rootReddit,

  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  googleTagManagerId: process.env.GOOGLE_TAG_MANAGER_ID,

  adblockTestClassName: process.env.ADBLOCK_TEST_CLASSNAME || 'ad adsense-ad googad gemini-ad openx',

  localStorageAvailable: localStorageAvailable(),

  statsURL: process.env.STATS_URL || 'https://stats.redditmedia.com/',
  reduxActionLogSize: process.env.REDUX_ACTION_LOG_SIZE || 50,
  mediaDomain: process.env.MEDIA_DOMAIN || 'www.redditmedia.com',
  adsPath: process.env.ADS_PATH || '/api/request_promo.json',
  manifest: {},

  trackerKey: process.env.TRACKER_KEY,
  trackerEndpoint: process.env.TRACKER_ENDPOINT,
  trackerClientSecret: process.env.TRACKER_SECRET,
  trackerClientAppName: process.env.TRACKER_CLIENT_NAME,

  // If statsdHost isn't set, then statsd is skipped
  statsdHost: process.env.STATSD_HOST,
  statsdPort: process.env.STATSD_PORT,
  statsdDebug: process.env.STATSD_DEBUG,
  statsdPrefix: process.env.STATSD_PREFIX || 'mweb2x.staging.server',
  statsdSocketTimeout: process.env.STATSD_TIMEOUT || 100,

  appName: process.env.APP_NAME || 'mweb',

  defaultCountry: process.env.DEFAULT_COUNTRY || 'US',

  // Note that this is a public key, so this can be shared.
  recaptchaSitekey: process.env.RECAPTCHA_SITEKEY || '6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC',
});

export default config();
