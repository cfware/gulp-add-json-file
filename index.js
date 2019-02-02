'use strict';

const {PassThrough} = require('stream');
const Vinyl = require('vinyl');

function fixupJSON(s, space) {
	return JSON.stringify(s, null, space)
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

function gulpAddJSON(path, object, space) {
	const stream = new PassThrough({objectMode: true});

	stream.write(new Vinyl({
		path,
		contents: Buffer.from(fixupJSON(object, space))
	}));

	return stream;
}

module.exports = gulpAddJSON;
