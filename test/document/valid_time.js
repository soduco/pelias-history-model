
var Document = require('../../Document');

module.exports.tests = {};

module.exports.tests.getValidTime = function (test) {
  test('getValidTime', function (t) {
    let doc = new Document('mysource', 'mylayer', 'myid');
    t.equal(doc.getValidTime(), undefined, 'getter works');
    doc.valid_time = { start: '2020-01-01', end: '2020-01-01' };
    t.equal(doc.getValidTime(), doc.valid_time, 'getter works');
    t.end();
  });
};

module.exports.tests.setValidTime = function(test) {
  test('setValidTime', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    const valid_time = { start: '2020-01-01', end: '2020-01-01' };
    t.equal(doc.setValidTime(valid_time), doc, 'chainable');
    t.deepEqual(doc.valid_time, JSON.stringify(valid_time), 'setter works');
    t.end();
  });

  test('setValidTime - validate', function(t) {
    const doc = new Document('mysource','mylayer','myid');
    t.throws( doc.setValidTime.bind(doc), null, 'invalid args (none)' );
    t.throws( doc.setValidTime.bind(doc,'not an object'), null, 'invalid args (not an object)' );
    t.throws( doc.setValidTime.bind(doc,{}), null, 'missing start' );
    t.throws( doc.setValidTime.bind(doc,{start:'not a date'}), null, 'invalid date type' );
    t.throws( doc.setValidTime.bind(doc,{start:'2020-0101'}), null, 'invalid date' );
    t.throws( doc.setValidTime.bind(doc,{start:'2020-01-01', end:'2020-0101'}), null, 'invalid date' );
    t.throws( doc.setValidTime.bind(doc,{start:'2020-01-02', end:'2020-01-01'}), null, 'end is before start' );
    t.end();
  });

  test('dates are truncated and formatted as YYYY-MM-DD', (t) => {
    const doc = new Document('mysource','mylayer','myid');
    doc.setValidTime({start:'2020-01-02 10:10:10'});   
    t.equals(JSON.parse(doc.getValidTime()).start, '2020-01-02' );
    t.end();
  });

  test('end date is equals to start date if not set in the initial input', (t) => {
    const doc = new Document('mysource','mylayer','myid');
    doc.setValidTime({start:'2020-01-02 10:10:10'});   
    t.equals(JSON.parse(doc.getValidTime()).end, '2020-01-02' );
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
