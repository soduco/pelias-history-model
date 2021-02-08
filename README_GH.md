# Pelias Geohistorical Model

This package stores an extension of the Pelias model that allows you to temporalize Pelias documents by assigning them a valid time.
This extension is part of the Pelias extension for historical geocoding.

# What is valid time

The valid time of a geographic record refers to the time interval during which the fact modeled by the record is regarded as true.
The validity of a fact can be known by direct observation (I saw the Eiffel Tower yesterday) or indirectly (Wikipedia tells me that the Eiffel Tower exists). This period of validity may be fully or only partially known.

A valid time can be imprecise or vague, either because it is roughly measured (end of construction: 1889), or because its definition is ambiguous (does the Eiffel Tower exist once the construction site is finished? from the first foundations? somewhere in between?).

It can also be known only partially, because the fact is still valid, or because its beginning is not known.

# New property : validtime
The model supports a subset of the syntax for time intervals in the [Linked Places](https://github.com/LinkedPasts/linked-places) schema.

It allows to describe time intervals defined by a starting and an ending expressed as ISO-8601 `YYYYY-MM-DD` dates.

The valid time "from March 10, 1850 to the year 2000" is written :
```json=
{
  start: {
    in: '1850-03-10'
  },
  end: {
    in: '2010'
  }
}
```

It is also possible to represent unbounded intervals.
For example, a period beginning in March 1950 would be written as follows: 
```json=
{
  start: {
    in: '1950-03'
  }
}
```

Pelias Geohistorical Model only supports simple time intervals, some elements of the LinkedPlaces schema are currently **not** supported:
- named periods 
- dates earliest / latest
- multiple intervals
- uncertainty and imprecision markers from the ISO 8601-2 draft 
 

### Temporal granularity
Month and day are optional, which enables dates to be expressed with year or month granularity.

However, the created Documents will **always** have valid times with day granularity. The model extrapolates partial dates to match the format `YYYY-MM-DD` using rues from the JS Date class. "1850" will therefore be transformed into "1850-01-01" and "1880-05" into "1880-05-01".

### Dates before the Gregorian calendar and dates BC.
As dates are in ISO-8601 format, only the Gregorian calendar (regular or proleptic) is supported and no conversion is done internally. You must express your valid times as intervals in the Gregorian calendar before loading your data into Pelias-GH. 

The years are coded on 4 digits, so the year 476 is written "0476".

Dates BC. are allowed and can be written using negative years.
By convention, 1 BC. is written as "0000", so "-0001" corresponds to year 2 BC.

### Informations additionelles
- all dates are handled as UTC dates
- bounds of time intervals are always considered closed. 
- an empty valid time means that the record is **always** valid, this is **not** the same as a non-temporalized record.