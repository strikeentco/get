get [![License](https://img.shields.io/npm/l/@strikeentco/get.svg)](https://github.com/strikeentco/get/blob/master/LICENSE)  [![npm](https://img.shields.io/npm/v/@strikeentco/get.svg)](https://www.npmjs.com/package/@strikeentco/get)
==========
[![Build Status](https://travis-ci.org/strikeentco/get.svg)](https://travis-ci.org/strikeentco/get)  [![node](https://img.shields.io/node/v/@strikeentco/get.svg)](https://www.npmjs.com/package/@strikeentco/get) [![Test Coverage](https://api.codeclimate.com/v1/badges/83783b3523a8819e5d34/test_coverage)](https://codeclimate.com/github/strikeentco/get/test_coverage)

One of the smallest (*23 sloc*) and most effective implementations of getting a nested value from an object.

# Usage

```sh
$ npm install @strikeentco/get --save
```

```javascript
const get = require('@strikeentco/get');

get({ a: { b: 'c' } }, 'a.b');
//=> 'c'

get({ a: { b: ['c', 'd'] } }, 'a.b.1');
//=> 'd'

get({ a: { b: ['c', 'd'] } }, ['a', 'b']);
//=> ['c', 'd']

get({ a: { b: 'c' } }, 'a.b.c.d');
//=> undefined

get({ a: { b: 'c' } }, 'a:b', ':');
//=> 'c'
```
## API

### get(obj, path, [separator])

#### Params:
* **obj** (*Object*) - Source object.
* **path** (*String|Array*) - String or array with path.
* **[separator]** (*String*) - `.` by default.

## Benchmarks
*(benchmarks were run on a Intel Core i5-6200U @ 2.30 GHz, 8 GB 2133 MHz DDR4)*

```
# deep.js (175 bytes)
  dot-prop x 633,102 ops/sec ±1.19% (85 runs sampled)
  get-value x 1,138,909 ops/sec ±1.80% (87 runs sampled)
  get x 2,066,525 ops/sec ±0.99% (90 runs sampled) - this library
  getobject x 170,159 ops/sec ±1.17% (88 runs sampled)
  lodash.get x 1,847,112 ops/sec ±0.60% (89 runs sampled)
  object-path x 126,724 ops/sec ±2.33% (86 runs sampled)

  fastest is get - this library

# root.js (210 bytes)
  dot-prop x 3,056,017 ops/sec ±1.84% (86 runs sampled)
  get-value x 11,121,668 ops/sec ±1.04% (87 runs sampled)
  get x 4,160,982 ops/sec ±1.06% (88 runs sampled) - this library
  getobject x 1,004,785 ops/sec ±1.19% (88 runs sampled)
  lodash.get x 6,529,634 ops/sec ±0.69% (90 runs sampled)
  object-path x 1,976,993 ops/sec ±1.97% (86 runs sampled)

  fastest is get-value

# shallow.js (84 bytes)
  dot-prop x 1,965,057 ops/sec ±1.64% (89 runs sampled)
  get-value x 2,697,800 ops/sec ±1.13% (87 runs sampled)
  get x 3,529,218 ops/sec ±1.13% (87 runs sampled) - this library
  getobject x 576,927 ops/sec ±1.04% (88 runs sampled)
  lodash.get x 3,145,038 ops/sec ±2.11% (87 runs sampled)
  object-path x 595,264 ops/sec ±3.33% (82 runs sampled)

  fastest is get - this library
```

Benchmark from [`jonschlinkert/get-value`](https://github.com/jonschlinkert/get-value/tree/master/benchmark) library.

## License

The MIT License (MIT)<br/>
Copyright (c) 2018 Alexey Bystrov
