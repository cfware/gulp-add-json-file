import path from 'path';
import fs from 'fs';
import stream from 'stream';
import {promisify} from 'util';
import {fileURLToPath} from 'url';

import t from 'libtap';
import concat from 'concat-stream';
import vinylFS from 'vinyl-fs';

// eslint-disable-next-line import/no-unresolved
import gulpAddJSON from 'gulp-add-json-file';

const pipeline = promisify(stream.pipeline);
const test = (name, helper, ...args) => t.test(name, t => helper(t, ...args));

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures');

const fixtureContents = {
	'file.js': fs.readFileSync(path.join(fixtures, 'file.js'), 'utf8')
};

async function basicTest(t, testFile, testObject, space) {
	let concatChecked = false;
	const expected = {
		...fixtureContents,
		[testFile]: JSON.stringify(testObject, null, space)
			.replace(/\u2028/gu, '\\u2028')
			.replace(/\u2029/gu, '\\u2029')
	};

	const concatStream = concat(data => {
		const expectKeys = Object.keys(expected);
		t.equal(data.length, expectKeys.length, 'number of objects');
		t.equal(data.length, [...new Set(expectKeys)].length, 'no duplicates');

		for (const f of data) {
			t.equal(f.contents.toString(), expected[f.relative], `expected contents ${f.relative}`);
		}

		concatChecked = true;
	});

	await pipeline(
		vinylFS.src(path.join(fixtures, '**'), {base: fixtures, nodir: true}),
		gulpAddJSON(testFile, testObject, space),
		concatStream
	);

	t.equal(concatChecked, true, 'finished');
}

t.type(gulpAddJSON, 'function');

test('default', basicTest, 'test.json', {name: 'value'});
test('space', basicTest, 'test.json', {name: 'value'}, 2);
test('U+2028', basicTest, 'test.json', {name: 'value\u2028'});
test('U+2029', basicTest, 'test.json', {name: 'value\u2029'});
