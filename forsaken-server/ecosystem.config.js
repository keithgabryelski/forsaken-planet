module.exports = {
  apps: [
    {
      name: "reports server",
      script: "server.mjs",
      watch: ".",
    },
  ],

  deploy: {
    production: {
      user: "ec2",
      host: "forsaken-planet.com",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
