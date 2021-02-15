const plaindate = require('pelias-contrib-gh').plaindate;

module.exports.uppercase = function( val ){
  return val.toUpperCase();
};

module.exports.lowercase = function( val ){
  return val.toLowerCase();
};

module.exports.stringify = function( val ){
  // because javascript: (''+undefined) === 'undefined'
  if( 'undefined' === typeof val ){
    return '';
  }
  return '' + val;
};

module.exports.floatify = function( precision, val ){
  return parseFloat( val ).toFixed( precision || 10 )/1;
};

module.exports.roundify = function( val ){
  return Math.round(val);
};

module.exports.toULLR = function( val ) {
  return JSON.stringify({
    min_lat: val.lowerRight.lat,
    max_lat: val.upperLeft.lat,
    min_lon: val.upperLeft.lon,
    max_lon: val.lowerRight.lon
  });
};

module.exports.toDaysSinceEpochInterval = function( val ){
  const days = (bound) => {
      const date = new Date(bound);
      return plaindate.to_days_since_epoch(date);
  };

  const interval = {};

  if (val.start && val.start.in){
    interval.start = days(val.start.in);
  }

  if (val.end && val.end.in){
    interval.end = days(val.end.in);
  }
  
  return interval;
};
