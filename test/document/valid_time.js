
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getValidTime = function (test) {
  test('getValidTime', function (t) {
    let doc = new Document('mysource', 'mylayer', 'myid');
    t.deepEqual(doc.getValidTime(), undefined, 'getter works');
    doc.valid_time = {start: {in: '1850'}, end: {in: '2000'}};
    t.deepEqual(doc.getValidTime(), doc.valid_time, 'getter works');
    t.end();
  });
};

module.exports.tests.setValidTime = function(test) {
  test('setValidTime', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    const valid_time = {start: {in: '1850'}, end: {in: '2000'}};
    t.equal(doc.setValidTime(valid_time), doc, 'chainable');
    t.deepEqual(doc.valid_time, {start: '1850-01-01', end: '2000-01-01'}, 'setter works');
    t.end();
  });
  

  test('setValidTime - validate', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setValidTime.bind(doc), null, 'invalid args (none)' );
    t.throws( doc.setValidTime.bind(doc,-1), null, 'invalid args (not an object)' );
    t.throws( doc.setValidTime.bind(doc,{}), null, 'empty valid time is forbidden' );
    t.throws( doc.setValidTime.bind(doc,{start: {in: 'not a date'}}), null, 'start should be a date');
    t.throws( doc.setValidTime.bind(doc,{end: {in: 'not a date'}}), null, 'end should be a date');
    t.end();
  });

  test('valid time consistency', function(t) {
    let valid_time = {start: {in: '1850'}, end: {in: '2000'}};
    const doc = new Document('mysource','mylayer','myid').setValidTime(valid_time);
    t.deepEqual(doc.valid_time, {start: '1850-01-01', end: '2000-01-01'}, 'year-only vtime shoud be transformed to year-month-day');
    valid_time = {start: {in: '1850-02'}, end: {in: '2000-05'}};
    doc.setValidTime(valid_time);
    t.deepEqual(doc.valid_time, {start: '1850-02-01', end: '2000-05-01'}, 'year-month vtime shoud be transformed to year-month-day');
    t.throws( doc.setValidTime.bind(doc,{start: {in: '1860'}, end: {in: '1850'}}), null, 'start should be leq than end');
    t.end();
  });

  test('left and right unbounded valid times', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    doc.setValidTime({start: {in: '2021'}});
    t.deepEqual(doc.valid_time, {start: '2021-01-01', end: '+275760-09-13'}, 'end should be JS max date if is right-unbounded');
    doc.setValidTime({end: {in: '2021'}});
    t.deepEqual(doc.valid_time, {start: '-271821-04-20', end: '2021-01-01'}, 'start should be JS min date if left-unbounded');    
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('valid_time: ' + name, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
