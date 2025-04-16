/** @type {import('next').NextConfig} */
const config = {
    webpack: (config, { isServer }) => {
      // Disable filesystem cache temporarily to force rebuilds
      config.cache = false;
      return config;
    },
    webpackDevMiddleware: config => {
      // Increase polling to fix file-watching issues in some environments
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      };
      return config;
    },
  };
  
  export default config;
  