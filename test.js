'use strict';

const should = require('should/as-function');
const get = require('./main');

describe('get', () => {
  it('should return non-object when given as the first argument', () => {
    should(get(null)).be.eql(null);
    should(get('foo')).be.eql('foo');
    should(get(['a'])).be.eql(['a']);
  });

  it('should get a value', () => {
    should(get({ a: 'a', b: { c: 'd' } }, 'a')).be.eql('a');
    should(get({ a: 'a', b: { c: 'd' } }, 'b.c')).be.eql('d');
    should(get({ foo: 'bar' }, 'foo.bar')).be.eql(undefined);
  });

  it('should get a value using custom separator', () => {
    should(get({ 'a.q': 'a', 'b.t': { 'c.i': 'd' } }, 'a.q', ':')).be.eql('a');
    should(get({ a: 'a', b: { c: 'd' } }, 'b:c', ':')).be.eql('d');
    should(get({ a: 'a', b: { c: 'd' } }, 'b->c', '->')).be.eql('d');
    should(get({ foo: 'bar' }, 'foo:bar', ':')).be.eql(undefined);
  });

  it('should get nested values', () => {
    const fixture = {
      a: { locals: { name: { first: 'Brian' } } },
      b: { locals: { name: { last: 'Woodward' } } },
      c: { locals: { paths: ['a.txt', 'b.js', 'c.hbs'] } }
    };
    should(get(fixture, 'a.locals.name')).be.eql({ first: 'Brian' });
    should(get(fixture, 'b.locals.name')).be.eql({ last: 'Woodward' });
    should(get(fixture, 'b.locals.name.last')).be.eql('Woodward');
    should(get(fixture, 'c.locals.paths.0')).be.eql('a.txt');
    should(get(fixture, 'c.locals.paths.1')).be.eql('b.js');
    should(get(fixture, 'c.locals.paths.2')).be.eql('c.hbs');
  });

  it('should get a value from an array', () => {
    const fixture = {
      a: { paths: ['a.txt', 'a.js', 'a.hbs'] },
      b: {
        paths: {
          0: 'b.txt',
          1: 'b.js',
          2: 'b.hbs',
          3: 'b3.hbs'
        }
      }
    };
    should(get(fixture, 'a.paths.0')).be.eql('a.txt');
    should(get(fixture, 'a.paths.1')).be.eql('a.js');
    should(get(fixture, 'a.paths.2')).be.eql('a.hbs');

    should(get(fixture, 'b.paths.0')).be.eql('b.txt');
    should(get(fixture, 'b.paths.1')).be.eql('b.js');
    should(get(fixture, 'b.paths.2')).be.eql('b.hbs');
    should(get(fixture, 'b.paths.3')).be.eql('b3.hbs');
  });

  it('should get a value from an object in an array', () => {
    should(get({ a: { b: [{ c: 'd' }] } }, 'a.b.0.c')).be.eql('d');
    should(get({ a: { b: [{ c: 'd' }, { e: 'f' }] } }, 'a.b.1.e')).be.eql('f');
  });

  it('should return `undefined` if the path is not found', () => {
    const fixture = { a: { b: {} } };
    should(get(fixture, 'a.b.c')).be.eql(undefined);
    should(get(fixture, 'a.b.c.d')).be.eql(undefined);
  });

  it('should get the specified property', () => {
    should(get({ a: 'aaa', b: 'b' }, 'a')).be.eql('aaa');
    should(get({ first: 'Jon', last: 'Schlinkert' }, 'first')).be.eql('Jon');
    should(get({ locals: { a: 'a' }, options: { b: 'b' } }, 'locals')).be.eql({ a: 'a' });
  });

  it('should support passing a property formatted as an array', () => {
    should(get({ a: 'aaa', b: 'b' }, ['a'])).be.eql('aaa');
    should(get({ a: { b: { c: 'd' } } }, ['a', 'b', 'c'])).be.eql('d');
    should(get({ first: 'Harry', last: 'Potter' }, ['first'])).be.eql('Harry');
    should(get({ locals: { a: 'a' }, options: { b: 'b' } }, ['locals'])).be.eql({ a: 'a' });
  });

  it('should get the value of a deeply nested property', () => {
    should(get({ a: { b: 'c', c: { d: 'e', e: 'f', g: { h: 'i' } } } }, 'a.c.g.h')).be.eql('i');
  });

  it('should return the entire object if no property is passed', () => {
    should(get({ a: 'a', b: { c: 'd' } })).be.eql({ a: 'a', b: { c: 'd' } });
  });

  it('should return the value using unicode key', () => {
    const obj = { '15\u00f8C': { '3\u0111': 1 } };
    should(get(obj, '15\u00f8C.3\u0111')).be.eql(1);
    should(get(obj, ['15\u00f8C', '3\u0111'])).be.eql(1);
  });

  it('should return the value using dot in key (with array of segments)', () => {
    should(get({ 'a.b': { 'looks.like': 1 } }, ['a.b', 'looks.like'])).be.eql(1);
  });

  it('should return the value under shallow object', () => {
    const obj = { a: 'b', };
    should(get(obj, 'a')).be.eql('b');
    should(get(obj, ['a'])).be.eql('b');
  });

  it('should return the value under deep object', () => {
    const obj = { b: { f: 'i' } };
    should(get(obj, 'b.f')).be.eql('i');
    should(get(obj, ['b', 'f'])).be.eql('i');
  });

  it('should return the value under array', () => {
    const obj = { b: { d: ['a', 'b'] } };
    should(get(obj, 'b.d.0')).be.eql('a');
    should(get(obj, ['b', 'd', 0])).be.eql('a');
  });

  it('should return the value under array deep', () => {
    const obj = { b: { e: [{}, { f: 'g' }], } };
    should(get(obj, 'b.e.1.f')).be.eql('g');
    should(get(obj, ['b', 'e', 1, 'f'])).be.eql('g');
  });

  it('should return undefined for missing values under object', () => {
    const obj = { a: 'b', };
    should(get(obj, 'a.b')).be.eql(undefined);
    should(get(obj, ['a', 'b'])).be.eql(undefined);
    should(get({ a: 5 }, ['a', 'b'])).be.eql(undefined);
    should(get({ a: null }, ['a', 'b'])).be.eql(undefined);
  });

  it('should return undefined for missing values under array', () => {
    const obj = { b: { d: ['a', 'b'], } };
    should(get(obj, 'b.d.5')).be.eql(undefined);
    should(get(obj, ['b', 'd', '5'])).be.eql(undefined);
  });

  it('should return the value under integer-like key', () => {
    const obj = { '1a': 'foo' };
    should(get(obj, '1a')).be.eql('foo');
    should(get(obj, ['1a'])).be.eql('foo');
  });

  it('should not fail on an object with a null prototype', () => {
    const foo = 'FOO';
    const objWithNullProto = Object.create(null);
    objWithNullProto.foo = foo;
    should(get(objWithNullProto, 'foo')).be.eql(foo);
  });

  it('should get non-"own" properties', () => {
    class Base {
      constructor() {
        this.one = { two: true };
      }
    }
    class Extended extends Base { }

    const extended = new Extended();

    should(get(extended, ['one', 'two'])).be.eql(true);
    extended.enabled = true;

    should(get(extended, 'enabled')).be.eql(true);
    should(get(extended, 'one')).be.eql({ two: true });
  });

  it('should handle invalid input', () => {
    const a = undefined;
    const b = {};

    should(get(a, 'sample')).be.eql(undefined);
    should(get(b, undefined)).be.eql({});
    should(get(b, '...')).be.eql(undefined);
  });

  it('should get shallow properties', () => {
    const fn = function () { };
    const a = {
      sample: 'string',
      example: fn,
      unknown: undefined
    };

    should(get(a, 'example')).be.eql(fn);
    should(get(a, 'sample')).be.eql('string');
    should(get(a, 'unknown')).be.eql(undefined);
    should(get(a, 'invalid')).be.eql(undefined);
  });
});
