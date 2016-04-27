require('../styles/style.css');
require('pixi');
require('p2');
require('./app/application');

var gameData = require('json!../testData/exampleGame');
var parser = require('./parser');
var parsedJson = parser(gameData);

// Construct phaser engine
var phaser = require('phaser');
var Engine = require('./engine/Engine.js');
var engine = new Engine(phaser, parsedJson);
