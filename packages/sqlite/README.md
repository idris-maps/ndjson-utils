# @ndjson-utils/sqlite

Stream ndjson to and from a SQLite database

## Install

```
npm install @ndjson-utils/sqlite
```

## `to-sql`

Arguments:

* `-t/--table` the table name (required)
* `-f/--file` the SQLite file (required)
* `-pk` column that should be private key (optional, a column will be added if not defined)

### Example usage

Suppose you have a ndjson stream such as `data.js`:

```js
const generate = () => JSON.stringify({
  num: Math.floor(Math.random() * 1000000),
  str: Math.random() > 0.5 ? 'AAA' : 'BBB'
})

let n = 0

while (n < 1000) {
  n = n + 1
  console.log(generate())
}
```

Insert it to a table `test` in `db.sqlite` with:

```bash
node data | to-sql -t test -f db.sqlite
```

## `from-sql`

Arguments:

* `-q/--query` the SQL query (required if `-qf/--queryFile` is not defined)
* `-qf/--queryFile` an `.sql` file with the query (required if `-q/--query` is not defined)
* `-f/--file` the SQLite file (required)
* `-n/--ndjson` return as ndjson stream (optional, returns a json array by default)

### Example usage

Extract the table created above to json:

```bash
from-sql -q "SELECT * FROM test" -f db.sqlite
```

to an ndjson stream:

```bash
from-sql -q "SELECT * FROM test" -f db.sqlite -n true
```

Or have a `query.sql` file as:

```sql
SELECT * FROM test
```

and run:

```bash
from-sql -qf query.sql -f db.sqlite -n true
```