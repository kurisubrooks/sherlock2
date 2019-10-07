module.exports = {
  temperature: {
    SI: {
      name: 'kelvin',
      unit: 'K',
      display: ['K', 'K'],
      match: [
        'kelvin',
        'k'
      ],
      toSI: unit => unit * 1,
      fromSI: unit => unit / 1
    },
    derived: [
      {
        name: 'celsius',
        unit: 'C',
        display: ['C', 'C'],
        match: [
          'celsius', 'centigrade',
          'c'
        ],
        toSI: unit => unit + 273.15,
        fromSI: unit => unit - 273.15
      },
      {
        name: 'fahrenheit',
        unit: 'F',
        display: ['F', 'F'],
        match: [
          'fahrenheit',
          'f'
        ],
        toSI: unit => (5 / 9 * (unit - 32)) + 273.15,
        fromSI: unit => (1.8 * (unit - 273.15)) + 32
      }
    ]
  },
  distance: {
    SI: {
      name: 'metre',
      unit: 'm',
      display: ['metre', 'metres'],
      match: [
        'metres', 'metre',
        'meters', 'meter',
        'm', '㍍'
      ],
      toSI: unit => unit * 1,
      fromSI: unit => unit / 1
    },
    derived: [
      {
        name: 'millimetre',
        unit: 'mm',
        display: ['millimetre', 'millimetres'],
        match: [
          'millimetres', 'millimetre',
          'millimeters', 'millimeter',
          'mm', '㍉'
        ],
        toSI: unit => unit / 1e3,
        fromSI: unit => unit * 1e3
      },
      {
        name: 'centimetre',
        unit: 'cm',
        display: ['centimetre', 'centimetres'],
        match: [
          'centimetres', 'centimetre',
          'centimeters', 'centimeter',
          'cm', '㎝', '㌢'
        ],
        toSI: unit => unit / 1e2,
        fromSI: unit => unit * 1e2
      },
      {
        name: 'kilometre',
        unit: 'km',
        display: ['kilometre', 'kilometres'],
        match: [
          'kilometres', 'kilometre',
          'kilometers', 'kilometer',
          'km', '㎞', '㌖'
        ],
        toSI: unit => unit * 1e3,
        fromSI: unit => unit / 1e3
      },
      {
        name: 'inch',
        unit: 'in',
        display: ['inch', 'inches'],
        match: [
          'inches', 'inch',
          'in', '㌅'
        ],
        toSI: unit => unit / 39.3701,
        fromSI: unit => unit * 39.3701
      },
      {
        name: 'foot',
        unit: 'ft',
        display: ['foot', 'feet'],
        match: [
          'foot', 'feet',
          'ft', '㌳'
        ],
        toSI: unit => unit / 39.3701 * 12,
        fromSI: unit => unit * 39.3701 / 12
      },
      {
        name: 'yard',
        unit: 'yd',
        display: ['yard', 'yards'],
        match: [
          'yards', 'yard',
          'yd', '㍎'
        ],
        toSI: unit => unit * 0.9144,
        fromSI: unit => unit / 0.9144
      },
      {
        name: 'mile',
        unit: 'mi',
        display: ['mile', 'miles'],
        match: [
          'miles', 'mile',
          'mi', '㍄'
        ],
        toSI: unit => unit * 1609.344,
        fromSI: unit => unit / 1609.344
      },
      {
        name: 'lunar distance',
        unit: 'ld',
        display: ['lunar distance', 'lunar distances'],
        match: [
          'lunar distances', 'lunar distance',
          'ld', 'lu'
        ],
        toSI: unit => unit / 384402e3,
        fromSI: unit => unit * 384402e3
      },
      {
        name: 'astronomical unit',
        unit: 'au',
        display: ['astronomical unit', 'astronomical units'],
        match: [
          'astronomical units', 'astronomical unit',
          'au', 'ua'
        ],
        toSI: unit => unit / 1495978707e2,
        fromSI: unit => unit * 1495978707e2
      },
      {
        name: 'parsec',
        unit: 'pc',
        display: ['parsec', 'parsecs'],
        match: [
          'parsecs', 'parsec',
          'pc'
        ],
        toSI: unit => unit / 3.08567758e16,
        fromSI: unit => unit * 3.08567758e16
      },
      {
        name: 'light year',
        unit: 'ly',
        display: ['light year', 'light years'],
        match: [
          'light years', 'light year',
          'ly'
        ],
        toSI: unit => unit / 9.4605284e15,
        fromSI: unit => unit * 9.4605284e15
      }
    ]
  },
  mass: {
    SI: {
      name: 'kilogram',
      unit: 'kg',
      display: ['kilogram', 'kilograms'],
      match: [
        'kilos', 'kilo',
        'kilogram', 'kilogram',
        'kg', '㎏', '㌕'
      ],
      toSI: unit => unit * 1,
      fromSI: unit => unit / 1
    },
    derived: [
      {
        name: 'milligram',
        unit: 'mg',
        display: ['milligram', 'milligrams'],
        match: [
          'milligrams', 'milligram',
          'mg', '㎎'
        ],
        toSI: unit => unit / 1e6,
        fromSI: unit => unit * 1e6
      },
      {
        name: 'gram',
        unit: 'g',
        display: ['gram', 'grams'],
        match: [
          'grams', 'gram',
          'g', '㌘'
        ],
        toSI: unit => unit / 1e3,
        fromSI: unit => unit * 1e3
      },
      {
        name: 'tonne',
        unit: 't',
        display: ['tonne', 'tonnes'],
        match: [
          'tonnes', 'tonne',
          'tons', 'ton',
          't', '㌧'
        ],
        toSI: unit => unit * 1e3,
        fromSI: unit => unit / 1e3
      },
      {
        name: 'pound',
        unit: 'lb',
        display: ['pound', 'pounds'],
        match: [
          'pounds', 'pound',
          'lb'
        ],
        toSI: unit => unit / 2.20462,
        fromSI: unit => unit * 2.20462
      },
      {
        name: 'ounce',
        unit: 'oz',
        display: ['ounce', 'ounces'],
        match: [
          'ounces', 'ounce',
          'oz'
        ],
        toSI: unit => unit / 35.2739619,
        fromSI: unit => unit * 35.2739619
      }
    ]
  },
  volume: {
    SI: {
      name: 'litre',
      unit: 'l',
      display: ['litre', 'litres'],
      match: [
        'litres', 'litre',
        'liters', 'liter',
        'l', '㍑'
      ],
      toSI: unit => unit * 1,
      fromSI: unit => unit / 1
    },
    derived: [
      {
        name: 'millilitre',
        unit: 'ml',
        display: ['millilitre', 'millilitres'],
        match: [
          'millilitres', 'millilitre', 'cubic centimetres', 'cubic centimetre',
          'milliliters', 'millileter', 'cubic centimeters', 'cubic centimeter',
          'ml', 'cm3', 'cm^3', 'cm³'
        ],
        toSI: unit => unit / 1e3,
        fromSI: unit => unit * 1e3
      },
      {
        name: 'cubic metre',
        unit: 'm³',
        display: ['cubic metre', 'cubic metres'],
        match: [
          'cubic metres', 'cubic metre',
          'cubic meters', 'cubic meter',
          'm3', 'm^3', 'm³'
        ],
        toSI: unit => unit * 1e3,
        fromSI: unit => unit / 1e3
      },
      {
        name: 'gallon',
        unit: 'gal',
        display: ['gallon', 'gallons'],
        match: [
          'gallons', 'gallon',
          'gal'
        ],
        toSI: unit => unit * 0.264172,
        fromSI: unit => unit / 0.264172
      },
      {
        name: 'pint',
        unit: 'pint',
        display: ['pint', 'pints'],
        match: [
          'pints', 'pint',
          'p'
        ],
        toSI: unit => unit * 2.11338,
        fromSI: unit => unit / 2.11338
      },
      {
        name: 'fluid ounce',
        unit: 'fl oz',
        display: ['fluid ounce', 'fluid ounces'],
        match: [
          'fluid ounces', 'fluid ounce',
          'fl oz', 'floz'
        ],
        toSI: unit => unit * 33.814,
        fromSI: unit => unit / 33.814
      }
    ]
  },
  time: {
    SI: {
      name: 'second',
      unit: 's',
      display: ['second', 'seconds'],
      match: [
        'seconds', 'second',
        'sec', 'secs', 's'
      ],
      toSI: unit => unit * 1,
      fromSI: unit => unit / 1
    },
    derived: [
      {
        name: 'nanosecond',
        unit: 'ns',
        display: ['nanosecond', 'nanoseconds'],
        match: [
          'nanoseconds', 'nano seconds',
          'nanosecond', 'nano second',
          'ns'
        ],
        toSI: unit => unit / 1e9,
        fromSI: unit => unit * 1e9
      },
      {
        name: 'microsecond',
        unit: 'μs',
        display: ['microsecond', 'microseconds'],
        match: [
          'microseconds', 'micro seconds',
          'microsecond', 'micro second',
          'μs'
        ],
        toSI: unit => unit / 1e6,
        fromSI: unit => unit * 1e6
      },
      {
        name: 'millisecond',
        unit: 'ms',
        display: ['millisecond', 'milliseconds'],
        match: [
          'milliseconds', 'milli seconds',
          'millisecond', 'milli second',
          'ms'
        ],
        toSI: unit => unit / 1e3,
        fromSI: unit => unit * 1e3
      },
      {
        name: 'minute',
        unit: 'm',
        display: ['minute', 'minutes'],
        match: [
          'minutes', 'minute',
          'min', 'mins', 'm'
        ],
        toSI: unit => unit * 6e1,
        fromSI: unit => unit / 6e1
      },
      {
        name: 'hour',
        unit: 'h',
        display: ['hour', 'hours'],
        match: [
          'hours', 'hour',
          'h'
        ],
        toSI: unit => unit * 36e2,
        fromSI: unit => unit / 36e2
      },
      {
        name: 'day',
        unit: 'day',
        display: ['day', 'days'],
        match: [
          'days', 'day',
          'd'
        ],
        toSI: unit => unit * 864e2,
        fromSI: unit => unit / 864e2
      },
      {
        name: 'week',
        unit: 'week',
        display: ['week', 'weeks'],
        match: [
          'weeks', 'week',
          'w'
        ],
        toSI: unit => unit * 6048e2,
        fromSI: unit => unit / 6048e2
      },
      {
        name: 'month',
        unit: 'month',
        display: ['month', 'months'],
        match: [
          'months', 'month'
        ],
        toSI: unit => unit * 2.628e6,
        fromSI: unit => unit / 2.628e6
      },
      {
        name: 'year',
        unit: 'year',
        display: ['year', 'years'],
        match: [
          'years', 'year'
        ],
        toSI: unit => unit * 3.154e7,
        fromSI: unit => unit / 3.154e7
      },
      {
        name: 'decade',
        unit: 'decade',
        display: ['decade', 'decades'],
        match: [
          'decades', 'decade'
        ],
        toSI: unit => unit * 3.154e8,
        fromSI: unit => unit / 3.154e8
      },
      {
        name: 'century',
        unit: 'century',
        display: ['century', 'centuries'],
        match: [
          'centuries', 'century'
        ],
        toSI: unit => unit * 3.154e9,
        fromSI: unit => unit / 3.154e9
      },
      {
        name: 'millennium',
        unit: 'millennium',
        display: ['millennium', 'millennia'],
        match: [
          'millennia', 'millenniums', 'millennium'
        ],
        toSI: unit => unit * 3.154e10,
        fromSI: unit => unit / 3.154e10
      }
    ]
  }
};
