const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
const { i18n } = require("./next-i18next.config");

module.exports = withPWA({
  i18n,
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
    runtimeCaching,
  },
  images: {
    domains: [
      "s3.amazonaws.com",
      "127.0.0.1",
      "localhost",
			"example.com",
			"admin.example.com",
			"store.example.com",			
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
