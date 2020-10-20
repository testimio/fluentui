'use strict';

let config = {};

switch (process.env.BENCHMARK_CONTROL_GROUP) {
  case 'png':
    config.features = {
      screenshots: {
        format: 'png',
      },
    };
    break;

  case 'network logs':
    config.features = {
      networkLogs: true,
    };
    break;

  case 'no console':
    config.features = {
      console: false,
    };
    break;

  case 'no screenshots':
    config.features = {
      screenshots: false,
    };
    break;

  case 'html':
    config.features = {
      html: true,
    };
    break;

  case 'defaults':
    break;
}

module.exports = config;
