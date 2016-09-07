let angular = require('angular');
let configuration = require('./shared');

configuration.constant('API_PATH', `//${window.location.host}/application/api`);

module.exports = configuration;
