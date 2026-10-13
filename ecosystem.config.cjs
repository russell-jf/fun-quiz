/**
 * PM2 config for Baota / Linux VPS
 * Usage: pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: "fun-quiz",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
        SITE_URL: "https://proballace.com",
        NEXT_PUBLIC_SITE_URL: "https://proballace.com",
      },
    },
  ],
};
