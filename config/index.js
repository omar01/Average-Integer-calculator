'use strict';

var nconf = require('nconf');
var toml = require('toml');
var path = require('path');
var fs = require('fs');
var defaultEnv = 'local';
var _ = require('lodash');

if (process.env.NODE_ENV === 'development') {
	process.env.NODE_ENV = 'local';
}

nconf.overrides({'NODE_ENV': process.env.NODE_ENV || defaultEnv});

var commonFilePath = path.join(__dirname, 'common.toml');
var commonFile = fs.readFileSync(commonFilePath, 'utf-8');
var common = toml.parse(commonFile);

var envFilePath = path.join(__dirname, nconf.get('NODE_ENV') + '.toml');
var envFile = fs.readFileSync(envFilePath, 'utf-8');
var env = toml.parse(envFile);

nconf.argv().env();
nconf.defaults(_.merge(common, env));

module.exports = nconf;
