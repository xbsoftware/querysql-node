JSON to SQL Query
==================

Converts JSON config to SQL Query

```json
{
  "glue": "and",
  "rules": [{
    "field":"age",
    "condition":{
      "type": "less",
      "filter": 42
    } 
  },{
    "field":"region",
    "includes": [1,2,6]
  }] 
}
```

### Supported operations ( type )

- equal
- notEqual
- contains
- notContains
- lessOrEqual
- greaterOrEqual
- less
- notBetween
- between
- greater
- beginsWith
- notBeginsWith
- endsWith
- notEndsWith

### nesting

Blocks can be nested like next

```json
{
  "glue": "and",
  "rules": [
    ruleA,
    {
      "glue": "or",
      "rules": [
        ruleC,
        ruleD
      ] 
    }
  ] 
}
```

### between / notBetween

For those operations, both start and end values can be provided

```json
{
    "field":"age",
    "condition":{
      "type": "between",
      "filter": { "start": 10, "end": 99 }
    } 
  }
```

if only *start* is provided the operation will automatically change to *less* (notBetween) or *greaterOrEqual* (between)

if only *end* is provided the operation will automatically change to *greater* (notBetween) or *lessOrEqual* (between)