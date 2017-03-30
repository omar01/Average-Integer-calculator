'use strict'

var randomIntegers = [];
var connection = require('amqplib').connect('amqp://localhost');

var calculateAverage = function(randomIntegers) {
	var total = 0;
	
	for(var i = 0; i < randomIntegers.length; i++) {
		total += randomIntegers[i];
	}

	return total / randomIntegers.length;
}

var consume = function() {
	connection.then(function(conn) {
		randomIntegers = [];
		process.once('SIGINT', function() { conn.close(); });
		return conn.createChannel().then(function(channel) {
			var queue = 'randomIntegersQueue';
			var ok = channel.assertQueue(queue, {durable: true});

			ok = ok.then(function() {
				return channel.consume(queue, appendMessageToArray, {noAck: true});
			});

			return ok.then(function() {
				console.log('Waiting for randomIntegers. To exit press CTRL+C');
			});

			function appendMessageToArray(msg) {
				randomIntegers.push(parseInt(msg.content.toString()));
			}
		});
	});
}

setInterval(function(){
	consume();
	console.log("The average integer for the last 5 seconds", calculateAverage(randomIntegers));
}, 5000);