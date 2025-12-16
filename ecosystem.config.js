module.exports = {
  apps: [
    {
      name: "predikr",
      cwd: "/var/www/predikr.code-dev.in", // IMPORTANT
      script: "npm",
      args: "start",
      env: {
        PORT: 3001,
        NODE_ENV: "production"
      }
    }
  ]
};
