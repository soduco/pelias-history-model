
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

module.exports.toDateInterval = function( val ){
  //const max_s = 864e13;
  //let min_date = new Date(-max_s);
  //let max_date = new Date(max_s);
  //let ms_in_day = 8.64e7; 

  //let start = val.start && val.start.in ? this.parseDate(val.start.in) : min_date; 
  //let end = val.end && val.end.in ? this.parseDate(val.end.in) : max_date;
  let interval = {};
  if (val.start && val.start.in){
    interval.start = this.parseDate(val.start.in);
  }
  if(val.end && val.end.in){
    interval.end = this.parseDate(val.end.in);
  }
  return interval;
};

module.exports.parseDate = function( val ){
  // JS date parser cannot handle negative dates correctly therefore we parse dates manually
  let re = /^(?<year>-?\d{4,})(?:-(?<month>\d{2})(?:-(?<day>\d{2}))?)?$/;
  let groups = re.exec(val).groups;
  let month = groups.month === undefined ? 1 : groups.month;
  let day = groups.day === undefined ? 1 : groups.day;
  return new Date(Date.UTC(groups.year, month - 1, day));
};

module.exports.toESStrictDate = function( date ){
 return date.toISOString().split('T')[0];
};
