# @ndjson-utils/vega-lite

Create [vega-lite](https://www.npmjs.com/package/vega-lite) spec from JSON or a NDJSON stream

Chart types:

* area
* bar
* line
* multiline
* pie
* scatter

## Install

```
npm install vega-lite @ndjson-utils/vega-lite
```

## Usage

If `data.json` is a JSON file with an array of objects of this type:

```ts
interface Item {
  label: string
  value: number
}
```

Create a bar chart:

```bash
cat data.json | bar | vl2svg > chart.svg
```

`bar` creates the vega-lite spec. `vl2svg` comes from `vega-lite` and turns a spec into SVG.

`bar` defaults to keys being called `label` and `value`, as in our data. Otherwise, use `-l` and `-v` to define the keys (see below).

---

If `data.ndjson` is a NDJSON file where each line is an object of the type:

```ts
interface Item {
  a_key: number
  b_key: number
}
```

Create a scatterplot:

```bash
cat data.ndjson | scatter -x a_key -y b_key -n true | vl2svg > chart.svg
```

The keys for the x and y axes are defined with `-x a_key -y b_key`. `-n true` tells `scatter` it receives NDJSON.

---

Use `--help` to see the expected arguments. For example:

```bash
pie --help
```

will return

```
usage: pie [-h] [-l LABEL] [-v VALUE] [-W WIDTH] [-H HEIGHT] [-n NDJSON]

Create a bar chart from JSON or NDJSON

optional arguments:
  -h, --help            show this help message and exit
  -l LABEL, --label LABEL
                        Label key (defaults to "label")
  -v VALUE, --value VALUE
                        Value key (defaults to "value")
  -W WIDTH, --width WIDTH
                        Chart width (defaults to "400")
  -H HEIGHT, --height HEIGHT
                        Chart height (defaults to "200")
  -n NDJSON, --ndjson NDJSON
                        Takes a NDJSON stream (defaults to JSON)
```

## `bar`

* `-l/--label` Label key (defaults to "label")
* `-v/--value` Value key (defaults to "value")
* `-W/--width` Chart width (defaults to "400")
* `-H/--height` Chart height (defaults to "200")
* `-n/--ndjson` Takes a NDJSON stream (defaults to JSON)

## `scatter`

* `-x` X axis key (defaults to "x")
* `-y` Y axis key (defaults to "y")
* `-W/--width` Chart width (defaults to "400")
* `-H/--height` Chart height (defaults to "400")
* `-n/--ndjson` Takes a NDJSON stream (defaults to JSON)

## `line`

Arguments:

* `-d/--date` Date key (defaults to "date")
* `-v/--value` Value key (defaults to "value")
* `-W/--width` Chart width (defaults to "400")
* `-H/--height` Chart height (defaults to "200")
* `-n/--ndjson` Takes a NDJSON stream (defaults to JSON)

## `area`

* `-d/--date` Date key (defaults to "date")
* `-v/--value` Value key (defaults to "value")
* `-W/--width` Chart width (defaults to "400")
* `-H/--height` Chart height (defaults to "200")
* `-n/--ndjson` Takes a NDJSON stream (defaults to JSON)

## `multiline`

* `-d/--date` Date key (defaults to "data")
* `-v/--values` Value keys (comma separated - required)
* `-W/--width` Chart width (defaults to "400")
* `-H/--height` Chart height (defaults to "200")
* `-n/--ndjson` Takes a NDJSON stream (defaults to JSON)

## `pie`

* `-l/--label` Label key (defaults to "label")
* `-v/--value` Value key (defaults to "value")
* `-W/--width` Chart width (defaults to "400")
* `-H/--height` Chart height (defaults to "200")
* `-n/--ndjson` Takes a NDJSON stream (defaults to JSON)
