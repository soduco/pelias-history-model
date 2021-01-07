var _ = require('lodash'),
    PeliasModelError = require('../errors').PeliasModelError,
    transform = require('./transform');

module.exports.type = function( type, val ){
  if( type.toLowerCase() === 'array' ){
    if( !Array.isArray( val ) ){
      throw new PeliasModelError( 'invalid document type, expecting: ' + type + ' got: ' + val );
    }
  } else {
    if( typeof val !== type ){
      throw new PeliasModelError( 'invalid document type, expecting: ' + type + ' got: ' + val );
    }
    if( type === 'number' && isNaN( val ) ){
      throw new PeliasModelError( 'invalid document type, expecting: number, got NaN: ' + val );
    }
    if( type === 'object' && Array.isArray( val ) ){
      throw new PeliasModelError( 'invalid document type, expecting: object, got array: ' + val );
    }
    if( type === 'object' && null === val ){
      throw new PeliasModelError( 'invalid document type, expecting: object, got null: ' + val );
    }
  }
  return this;
};

module.exports.truthy = function( val ){
  if( (typeof val === 'string' && !val.trim() ) || !val ){
    throw new PeliasModelError( 'invalid document type, expecting: truthy, got: ' + val );
  }
  return this;
};

module.exports.nonnegative = function( val ){
  if( val < 0 ){
    throw new PeliasModelError( 'invalid document type, expecting: 0 or a positive number, got: ' + val );
  }
  return this;
};

module.exports.length = function( length, val ){
  if( val.length !== length ){
    throw new PeliasModelError( 'invalid property length, expecting: ' + length + ' got: ' + val);
  }
  return this;
};

module.exports.geo = function( axis, val ){
  if( typeof val !== 'number' ){
    throw new PeliasModelError( 'invalid geo ' + axis + ', expecting: number, got: ' + val );
  }
  if( axis === 'latitude' ){
    if( val < -90 || val > 90 ){
      throw new PeliasModelError( 'invalid axis: ' + axis + ', ' + val );
    }
  } else if( axis === 'longitude' ){
    if( val < -180 || val > 180 ){
      throw new PeliasModelError( 'invalid axis: ' + axis + ', ' + val );
    }
  } else {
    throw new PeliasModelError( 'invalid axis: ' + axis );
  }
  return this;
};

// validate prop against a properties whitelist
module.exports.property = function( propList, prop ){
  if( -1 === propList.indexOf( prop ) ){
    throw new PeliasModelError( 'invalid property: ' + prop + ', should be one of: ' + propList.join(',') );
  }
  return this;
};

module.exports.boundingBox = function( val ) {
  // upperLeft must be an object
  if (!_.isObject(val.upperLeft)) {
    throw new PeliasModelError('invalid boundingBox, non-object property \'upperLeft\'');
  }
  // must have upperLeft.lat within valid range
  if (!_.isFinite(val.upperLeft.lat) || val.upperLeft.lat < -90 || val.upperLeft.lat > 90) {
    throw new PeliasModelError('invalid boundingBox, property \'upperLeft\.lat\' must be within range -90 to 90');
  }
  // must have upperLeft.lon within valid range
  if (!_.isFinite(val.upperLeft.lon) || val.upperLeft.lon < -180 || val.upperLeft.lon > 180) {
    throw new PeliasModelError('invalid boundingBox, property \'upperLeft\.lon\' must be within range -180 to 180');
  }

  // lowerRight must be an object
  if (!_.isObject(val.lowerRight)) {
    throw new PeliasModelError('invalid boundingBox, non-object property \'lowerRight\'');
  }
  // must have lowerRight.lat within valid range
  if (!_.isFinite(val.lowerRight.lat) || val.lowerRight.lat < -90 || val.lowerRight.lat > 90) {
    throw new PeliasModelError('invalid boundingBox, property \'lowerRight\.lat\' must be within range -90 to 90');
  }
  // must have lowerRight.lon within valid range
  if (!_.isFinite(val.lowerRight.lon) || val.lowerRight.lon < -180 || val.lowerRight.lon > 180) {
    throw new PeliasModelError('invalid boundingBox, property \'lowerRight\.lon\' must be within range -180 to 180');
  }

  // geometry must be internally consistent
  if (val.upperLeft.lat < val.lowerRight.lat) {
    throw new PeliasModelError('invalid boundingBox, upperLeft.lat must be >= lowerRight.lat');
  }

  // normalize lon values by adding 360 so that only positives are compared
  if (val.upperLeft.lon+360 > val.lowerRight.lon+360) {
    throw new PeliasModelError('invalid boundingBox, upperLeft.lon must be <= lowerRight.lon');
  }
  
  return this;
};

module.exports.regex = {
  nomatch: function(val, regex) {
    if( regex.test(val) ){
      throw new PeliasModelError(`invalid regex test, ${val} should not match ${regex}`);
    }

    return module.exports;
  },

  match: function(val, regex) {
    if( !regex.test(val) ){
      throw new PeliasModelError(`invalid regex test, ${val} should match ${regex}`);
    }

    return module.exports;
  }
};

module.exports.timespan = function( val ){
  // either start or end can be unset but not both
  if (!(val.start || val.end)){
    throw new PeliasModelError(`valid time must have at least one bound`);
  }
  if( val.start ){
    this.timespanExtremity(val.start);
  }
  if( val.end ){
    this.timespanExtremity(val.end);
  }
  return this;
};

module.exports.timespanExtremity = function( val ){
  this.type('object', val).truthy(val);
  // Contains either a 'in' element, or a pair or 'earliest' and 'latest' elements.
  if( val.in ){
    this.date(val.in);
  }else if (val.earliest && val.latest){
    this.date(val.earliest).date(val.latest);
  }else{
    throw new PeliasModelError(`invalid timespan ${val}`);
  }
  return this;
};

module.exports.date = function( val ){
  let date = transform.parseDate(val);  
  if ( isNaN(date.getTime()) ){
    throw new PeliasModelError(`invalid date ${val}`);
  }
    return this;
};

module.exports.geq = function( a, b ){
  if ( a < b ){
    throw new PeliasModelError(`${a} is not greater than or equal to ${b}`);
  }
  return this;
};
