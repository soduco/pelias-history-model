## Installation

```bash
$ npm install pelias-model
```

[![NPM](https://nodei.co/npm/pelias-model.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-model)

## Document

The `Document` model is a convenient way of modelling POI and admin records so that they are compatible with the Pelias import pipeline.

Using this model ensures that your import script will continue to work even when the underlying schema changes.

```javascript
var Document = require('pelias-model').Document;

var poi = new Document( 'geoname', 1003 )
  .setAlpha3( 'GBR' )
  .setMeta( 'author', 'peter' )
  .setMeta( 'date', new Date().getTime() )
  .setName( 'default', 'Hackney City Farm' )
  .setName( 'alt', 'Haggerston City Farm' )
  .setAdmin( 'admin0', 'Great Britain' )
  .setAdmin( 'neighborhood', 'Shoreditch' )
  .setCentroid({ lon: 0.5, lat: 50.1 });

console.log( poi );
```

**Note** the `_meta` property is unenumerable, so you won't see it when you `console.log` or `JSON.stringify` the object, don't worry it's still there:

```javascript
var poi = new Document( 'geoname', 1003 );
poi.setMeta( 'author', 'peter' );

console.log( poi, poi.getMeta( 'author' ), poi._meta );
```

## NPM Module

The `pelias-model` npm module can be found here:

[https://npmjs.org/package/pelias-model](https://npmjs.org/package/pelias-model)

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

Travis tests every release against node version `0.10`

[![Build Status](https://travis-ci.org/pelias/model.png?branch=master)](https://travis-ci.org/pelias/model)