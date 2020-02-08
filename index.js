import {PassThrough} from 'stream';
import Vinyl from 'vinyl';

const stringifyJSON = (...args) => JSON.stringify(...args)
	.replace(/\u2028/gu, '\\u2028')
	.replace(/\u2029/gu, '\\u2029');

export default function gulpAddJSON(path, object, space) {
	const stream = new PassThrough({objectMode: true});
	const contents = Buffer.from(stringifyJSON(object, null, space));

	stream.write(new Vinyl({path, contents}));

	return stream;
}
