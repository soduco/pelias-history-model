
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getValidTime = function (test) {
  test('getValidTime', function (t) {
    let doc = new Document('mysource', 'mylayer', 'myid');
    t.equal(doc.getValidTime(), undefined, 'getter works');
    doc.valid_time = { start: 2020, end: 2020 };
    t.equal(doc.getValidTime(), doc.valid_time, 'getter works');
    t.end();
  });
};

module.exports.tests.setValidTime = function(test) {
  test('setValidTime', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    t.equal(doc.setValidTime('2020'), doc, 'chainable');
    const valid_time = {start:2020, end:2020};
    t.deepEqual(doc.valid_time, valid_time, 'setter works');
    t.end();
  });
  
  test('setValidTime - validate', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setValidTime.bind(doc), null, 'invalid args (none)' );
    t.throws( doc.setValidTime.bind(doc,-1), null, 'invalid args (not a string)' );
    t.throws( doc.setValidTime.bind(doc,''), null, 'empty interval is forbidden' );
    t.throws( doc.setValidTime.bind(doc,'not-a-year-interval'), null, 'not a year interval' );
    t.throws( doc.setValidTime.bind(doc,'{1,2*'), null, 'invalid interval boundary character' );
    t.throws( doc.setValidTime.bind(doc,'1,-'), null, 'invalid interval 1' );
    t.throws( doc.setValidTime.bind(doc,'-,1'), null, 'invalid interval 2' );
    t.throws( doc.setValidTime.bind(doc,'1)'), null, 'invalid instant' );
    t.throws( doc.setValidTime.bind(doc,'275761'), null, 'must be a valid date (> max possible year)' );
    t.throws( doc.setValidTime.bind(doc,'-271822'), null, 'must be a valid date (< min possible year)' );
    t.throws( doc.setValidTime.bind(doc,'2,1'), null, 'lower bound <= upper bound' );
    t.throws( doc.setValidTime.bind(doc,'(1,2)'), null, 'lower bound <= upper bound' );
    t.end();
  });

  test('valid time can be a single positive or negative year', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    doc.setValidTime('2020');
    t.equal(doc.valid_time.start, 2020, 'positive year');
    doc.setValidTime('-2020');
    t.equal(doc.valid_time.start, -2020, 'negative year');
    t.end();
  });

  test('valid time: boundary characters', function(t) {
    let doc1 = new Document('mysource','mylayer','myid').setValidTime('[1,2]');
    let doc2 = new Document('mysource','mylayer','myid').setValidTime('1,2');
    t.deepEqual(doc1.valid_time, doc2.valid_time, 'interval without boudary symbols is closed');
    
    doc1 = new Document('mysource','mylayer','myid').setValidTime(']1,5[');
    doc2 = new Document('mysource','mylayer','myid').setValidTime('(1,5)');
    t.deepEqual(doc1.valid_time, doc2.valid_time, 'open interval as ][ or ()');
    t.end();
  });

  test('valid time: interval category', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    doc.setValidTime('1,3');
    t.deepEqual(doc.valid_time, {start: 1, end: 3}, 'closed interval without brackets');
    doc.setValidTime('[1,3]');
    t.deepEqual(doc.valid_time, {start: 1, end: 3}, 'closed interval with brackets');
    doc.setValidTime('(1,3]');
    t.deepEqual(doc.valid_time, {start: 2, end: 3}, 'left half-open interval');
    doc.setValidTime('[1,3)');
    t.deepEqual(doc.valid_time, {start: 1, end: 2}, 'right half-open interval');
    doc.setValidTime('(1,3)');
    t.deepEqual(doc.valid_time, {start: 2, end: 2}, 'open interval with parentheses');
    doc.setValidTime(']1,3[');
    t.deepEqual(doc.valid_time, {start: 2, end: 2}, 'open interval with brackets');
    t.end();
  });

  test('valid time: undefined bounds', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    doc.setValidTime(',');
    t.deepEqual(doc.valid_time, {start: -271821, end: 275760}, 'undefined left & right bounds');
    doc.setValidTime('(,)');
    t.deepEqual(doc.valid_time, {start: -271821, end: 275760}, 'undefined left & right bounds');
    doc.setValidTime(',2');
    t.deepEqual(doc.valid_time, {start: -271821, end: 2}, 'undefined left bound');
    doc.setValidTime('1,');
    t.deepEqual(doc.valid_time, {start: 1, end: 275760}, 'undefined right bound');
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
