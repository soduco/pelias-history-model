
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

module.exports.toYearInterval = function( val ){
  const max_time = 8640000000000000;
  
  const year_sup = new Date(max_time).getUTCFullYear();
  const year_inf = new Date(-max_time).getUTCFullYear();
  
  //Replaces undefined values with minimum/maximum dates so e.g. interval (,) becomes (year_inf, year_sup).
  let lower_bound = val.lyear? val.lyear : year_inf;
  let upper_bound = val.ryear? val.ryear : year_sup;

  if(val.single){
    return {
      start: val.single,
      end: val.single
    };
  }

  lower_bound += (val.lyear && ['(',']'].includes(val.lpar) && lower_bound > year_inf ) ? 1 : 0;
  upper_bound -= (val.ryear && [')','['].includes(val.rpar) && upper_bound < year_sup ) ? 1 : 0;

  return {
    start: lower_bound,
    end: upper_bound
  };
};
