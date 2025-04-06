const express = require('express');
const config = require('../config/config');
const server = require('./Infrastructures/http/server');
const container = require('./Infrastructures/container');
const app = express();

// setup server
server(app, container);
// start server
app.listen(config.app.port, () => {
  console.log(`Server running on port ${config.app.port}`);
});

module.exports = app;