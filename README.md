# recently
Helper to get the last time something happened 

## Initialization

```
var Recently = require('recently');
var cache = new Recently();
```

Add some items:

```
cache.add('a');
cache.add('b');
cache.add('b');
cache.add('c');
```

We can also initialize as follows:
```
var Recently = require('recently');
var cache = new Recently(['a','b','b','c']);
```

## last([value], number)
Retrieves the last items that were inserted into the cache. 

### Arguments 
1. [value]. Optional value which, when present, is used to compare to each item in the cache. If present then last() returns a count. 
2. number. The number of items to extract from the cache.    

### Returns
If value is present, a bool is returned (true if the item was found). If value is not present, then an array is returned

### Example

```
// get the last two items in the cache
cache.last(2); // returns ['b','c']

// count the number of times that 'b' occurs in the last 3 items
cache.last('b', 3); // returns 2
```

## lastTime(value)
Retrieves the last time a given value was added to the cache.  

### Arguments 
1. [value]. The value to retrieve from the cache 

### Returns
A date in ISO format if the item is found (or null if not) 

### Example

```
var cache = new Recently();
cache.add('a');
cache.add('b');
cache.add('b');

// get the last time the item 'b' was entered 
cache.lastTime('b'); // returns a date in ISO format (e.g. 2016-07-13T19:12:07.602Z)
```


## ago([value], seconds)
Retrieves the items in the cache since a certain duration from insertion.

### Arguments
1. [value]. Optional value which, when present, is used to compare to each item in the cache. If present then ago() returns a count. 
2. seconds. The number of seconds back we want to check the cache.

### Return
If value is present, a bool is returned (true if the item was found). If value is not present, then an array is returned

### Example
Imagine we enter some value over time:

```
// add one item
cache.add(true);
// wait 1s and add another 
setTimeout(() => {
    cache.add(true);
    // add 1.5s more and add a final one
    setTimeout(() => {
        cache.add(false);
    }, 1500);
}, 1000);
```

Now if were to immediately query the cache with the .ago() method, we would see the following:
```
// get the items from the cache based on # of seconds
cache.ago(1); // returns [false]
cache.ago(2); // returns [true,false]
cache.ago(3); // returns [true,true,false]
```

As with, the last() method, an optional value can also be provided:
```
// count the number of items in the cache that match 'true'
cache.ago(true, 2); // returns 1

// count the number of items in the cache that match 'false'
cache.ago(true, 3); // returns 2

// count the number of items in the cache that match 'false'
cache.ago(false, 2); // returns 1
```

