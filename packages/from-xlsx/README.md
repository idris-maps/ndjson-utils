# @ndjson-utils/from-xlsx

Stream ndjson from an excel file

## Install

```
npm install @ndjson-utils/from-xlsx
```

## Usage

Arguments:

* `-f/--file` the excel file (required)
* `-s/--sheet` the sheet (required)
* `-n/--ndjson` return as ndjson stream (optional, returns a json array by default)

```bash
npx from-xlsx -f my_file.xlsx -s my_sheet -n true
```

