# gulp-add-json-file

[![Travis CI][travis-image]][travis-url]
[![Greenkeeper badge][gk-image]](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

Add a JSON formatted file to a gulp stream.

### Install gulp-add-json-file

This module requires node.js 13.8.0 or above.

```sh
npm i -D gulp gulp-add-json-file
```

## Usage

```js
import {promisify} from 'util';
import stream from 'stream';

import gulp from 'gulp';
import gulpAddJSON from 'gulp-add-json-file';

const pipeline = promisify(stream.pipeline);

gulp.task('default', () => {
	/* Copy 'src/**' to 'dest', add 'filename.json' from JS object. */
	return pipeline(
		gulp.src('src/**'),
		gulpAddJSON('filename.json', {field: 'value'}),
		gulp.dest('dest')
	);
});
```

### gulpAddJSON(filename, object, space)

* **filename**: The filename to use when adding a vinyl object
* **object**: The JavaScript object to stringify as contents of the vinyl object
* **space**: Passed directly to [JSON.stringify].

## U+2028 and U+2029

Literal code points U+2028 and U+2029 are escaped for maximum compatibility.

## Duplicate files

This module should not be used to add a duplicate filename to the gulp stream.  In
the above example if `src/filename.json` exists it should be filtered out from
`gulp.src`.


[npm-image]: https://img.shields.io/npm/v/gulp-add-json-file.svg
[npm-url]: https://npmjs.org/package/gulp-add-json-file
[travis-image]: https://travis-ci.org/cfware/gulp-add-json-file.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/gulp-add-json-file
[gk-image]: https://badges.greenkeeper.io/cfware/gulp-add-json-file.svg
[downloads-image]: https://img.shields.io/npm/dm/gulp-add-json-file.svg
[downloads-url]: https://npmjs.org/package/gulp-add-json-file
[license-image]: https://img.shields.io/npm/l/gulp-add-json-file.svg
[JSON.stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_space_argument
