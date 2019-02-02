import path from 'path';
import fs from 'fs';

import test from 'ava';
import concat from 'concat-stream';
import gulp from 'gulp';
import pump from 'pump';

import gulpAddJSON from '..';

const fixtures = path.join(__dirname, 'fixtures');
const fixtureContents = {
	'file.js': fs.readFileSync(path.join(fixtures, 'file.js'), 'utf8')
};

function basicTest(t, testFile, testObject, space) {
	const pr = {};
	const expected = {
		...fixtureContents,
		[testFile]: JSON.stringify(testObject, null, space)
			.replace(/\u2028/g, '\\u2028')
			.replace(/\u2029/g, '\\u2029')
	};

	const concatStream = concat(data => {
		const expectKeys = new Set(Object.keys(expected));

		data.forEach(f => {
			t.true(expectKeys.delete(f.relative));
			t.is(f.contents.toString(), expected[f.relative]);
		});
		t.is(expectKeys.size, 0);

		pr.resolve();
	});

	pump(
		gulp.src(path.join(__dirname, 'fixtures', '**'), {base: fixtures, nodir: true}),
		gulpAddJSON(testFile, testObject, space),
		concatStream
	);

	return new Promise(resolve => {
		pr.resolve = resolve;
	});
}

test('export', t => t.is(typeof gulpAddJSON, 'function'));
test('default', basicTest, 'test.json', {name: 'value'});
test('space', basicTest, 'test.json', {name: 'value'}, 2);
test('U+2028', basicTest, 'test.json', {name: 'value\u2028'});
test('U+2029', basicTest, 'test.json', {name: 'value\u2029'});
