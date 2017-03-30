'use strict'

var randomInt = require('random-int');
var rabbitMq = require('../config').get('RABBIT_MQ');
var connection = require('amqplib').connect('amqp://' + rabbitMq.host + ':' +rabbitMq.port);

var publish = function(){
	connection.then(function(conn) {
		return conn.createChannel().then(function(channel) {
			var queue = 'randomIntegersQueue';
			var ok = channel.assertQueue(queue, {durable: true})

			var message = randomInt(1, 10000).toString();

			return ok.then(function() {
				channel.sendToQueue(queue, new Buffer(message));
				console.log(" Message published '%s'", message);
				return channel.close();
			});
		}).catch(function(err) { conn.close(); });
	});
}

setInterval(publish, 100);