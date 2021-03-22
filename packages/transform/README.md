# @ndjson-utils/transform

A collection of functions to transform a NDJSON stream

## Install

```
npm install @ndjson/transform
```

## Usage

```
cat data.ndjson | <FUNCTION> <...ARGUMENTS>
```

## `count`

Count the number of rows. Returns a single number.

## `filter`

Takes one argument, the result of a `(d, i) =>` function that returns a boolean.

If `data.ndjson` is:

```js
{ "price": 14.55, "product": "A" }
{ "price": 6.95, "product": "B" }
{ "price": 18.15, "product": "C" }
```

```
cat data.ndjson | npx filter 'd.price > 10'
```

will return:

```js
{ "price": 14.55, "product": "A" }
{ "price": 18.15, "product": "C" }
```

## `group`

Takes one argument, the result of a `(d, i) =>` function.

If `data.ndjson` is:

```js
{ "price": 14.55, "product": "A" }
{ "price": 16.15, "product": "B" }
{ "price": 6.95, "product": "A" }
{ "price": 7.85, "product": "B" }
```

```
cat data.ndjson | npx group 'd.product'
```

will return:

```js
[{"price":14.55,"product":"A"},{"price":6.95,"product":"A"}]
[{"price":16.15,"product":"B"},{"price":7.85,"product":"B"}]
```

and

```
cat data.ndjson | npx group 'i > 2'
```

will return:

```js
[{"price":14.55,"product":"A"},{"price":16.15,"product":"B"},{"price":6.95,"product":"A"}]
[{"price":7.85,"product":"B"}]
```

## `map`

Takes one argument, the result of a `(d, i) =>` function.

If `data.ndjson` is:

```js
{ "price": 14.55, "product": "A" }
{ "price": 6.95, "product": "B" }
{ "price": 18.15, "product": "C" }
```

```
cat data.ndjson | npx map '{...d, shop: "X", index: i }'
```

will return:

```js
{"price":14.55,"product":"A","shop":"X","index":0}
{"price":6.95,"product":"B","shop":"X","index":1}
{"price":18.15,"product":"C","shop":"X","index":2}
```

## `num`

Cast values to numbers. Useful after converting a csv file where all values are strings.

Takes one argument, a comma separated list of keys.

If `data.ndjson` is:

```js
{ "amount": "3", "price": "3.45", "product": "A" }
{ "amount": "2", "price": "5.95", "product": "B" }
```

```
cat data.ndjson | npx num 'amount,price'
```

```js
{"amount":3,"price":3.45,"product":"A"}
{"amount":2,"price":5.95,"product":"B"}
```


## `omit`

To remove keys. Takes one argument, a comma separated list of keys.

If `data.ndjson` is:

```js
{ "amount": "3", "price": "3.45", "product": "A" }
{ "amount": "2", "price": "5.95", "product": "B" }
```

```
cat data.ndjson | npx omit 'price,product'
```

returns

```js
{"amount":"3"}
{"amount":"2"}
```

## `pairs`

Returns an array of key value pairs.

If `data.ndjson` is:

```js
{ "amount": "3", "price": "3.45", "product": "A" }
{ "amount": "2", "price": "5.95", "product": "B" }
```

```
cat data.ndjson | npx pairs
```

returns

```js
[["amount","3"],["price","3.45"],["product","A"]]
[["amount","2"],["price","5.95"],["product","B"]]
```

## `pick`

Pick keys. Takes one argument, a comma separated list of keys.

If `data.ndjson` is:

```js
{ "amount": "3", "price": "3.45", "product": "A" }
{ "amount": "2", "price": "5.95", "product": "B" }
```

```
cat data.ndjson | npx pick 'price,product'
```

returns

```js
{"price":"3.45","product":"A"}
{"price":"5.95","product":"B"}
```

## `reduce`

If no arguments are passed, converts the NDJSON to a JSON array.

If `data.ndjson` is:

```js
{ "amount": "3", "price": "3.45", "product": "A" }
{ "amount": "2", "price": "5.95", "product": "B" }
```

```
cat data.ndjson | npx reduce
```

returns

```json
[{"amount":"3","price":"3.45","product":"A"},{"amount":"2","price":"5.95","product":"B"}]
```

First argument is the result of a `(r, d, i) =>` function. Where `r` is the current value.

Second argument is the initial value, defaults to `[]`.

If `data.ndjson` is:

```js
{ "amount": 2, "price": 14, "product": "A" }
{ "amount": 1, "price": 16, "product": "B" }
{ "amount": 1, "price": 6, "product": "A" }
{ "amount": 3, "price": 7, "product": "B" }
```

```
cat data.ndjson \
  | node dist/reduce '{...r, [d.product]: (r[d.product] || 0) + d.amount * d.price}' '{}'
```

returns:

```json
{"A":34,"B":37}
```

## `split`

Turn a JSON file in an NDJSON stream.

Arguments:

* first argument, the JSON file
* second argument (optional) a dot separated path to the array to stream.

If `data.json` is:

```json
[
  { "amount": 2, "price": 14, "product": "A" },
  { "amount": 1, "price": 16, "product": "B" },
  { "amount": 1, "price": 6, "product": "A" },
  { "amount": 3, "price": 7, "product": "B" },
]
```

```bash
npx split data.json
```

returns:

```js
{ "amount": 2, "price": 14, "product": "A" }
{ "amount": 1, "price": 16, "product": "B" }
{ "amount": 1, "price": 6, "product": "A" }
{ "amount": 3, "price": 7, "product": "B" }
```

If `data.json` is:

```json
{
  "results": [
    {
      "sales": [
        { "amount": 2, "price": 14, "product": "A" },
        { "amount": 1, "price": 16, "product": "B" },
        { "amount": 1, "price": 6, "product": "A" },
        { "amount": 3, "price": 7, "product": "B" },
      ]
    }
  ]
}
```

```bash
npx split data.json results.0.sales
```

returns:

```js
{ "amount": 2, "price": 14, "product": "A" }
{ "amount": 1, "price": 16, "product": "B" }
{ "amount": 1, "price": 6, "product": "A" }
{ "amount": 3, "price": 7, "product": "B" }
```

## `sum`

Takes one argument, the key to sum.

If `data.ndjson` is:

```js
{ "amount": 2, "price": 14, "product": "A" }
{ "amount": 1, "price": 16, "product": "B" }
{ "amount": 1, "price": 6, "product": "A" }
{ "amount": 3, "price": 7, "product": "B" }
```

```
cat data.ndjson | npx sum amount
```

returns `7`


## `uniq`

If no arguments are passed, returns unique rows.

If `data.ndjson` is:

```js
{ "amount": 2, "product": "A" }
{ "amount": 1, "product": "B" }
{ "amount": 2, "product": "A" }
{ "amount": 3, "product": "B" }
```

```
cat data.ndjson | npx uniq
```

returns:

```js
{"amount":2,"product":"A"}
{"amount":1,"product":"B"}
{"amount":3,"product":"B"}
```

If an argument is provided as the result of a function `(d, i) =>`, rows on which the value has already been returned are ignored.

On the same `data.ndjson`,

```
cat data.ndjson | npx uniq 'd.product'
```

will return:

```js
{"amount":2,"product":"A"}
{"amount":1,"product":"B"}
```

## `values`

Returns an array with the values of the row.

If `data.ndjson` is:

```js
{ "amount": 2, "product": "A" }
{ "amount": 1, "product": "B" }
{ "amount": 2, "product": "A" }
{ "amount": 3, "product": "B" }
```

```
cat data.ndjson | npx values
```

returns:

```js
[2,"A"]
[1,"B"]
[2,"A"]
[3,"B"]
```
