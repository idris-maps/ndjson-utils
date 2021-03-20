import { ArgumentParser } from 'argparse'
import Reader from 'line-by-line'
import getColumns, { ColumnWithKey } from './columnsFromJson'
import initDb, { DB } from './sql'

const parser = new ArgumentParser({
  description: 'Stream NDJSON to SQLite',
})

parser.add_argument('-t', '--table', { required: true, help: 'Table name' })
parser.add_argument('-f', '--file', { required: true, help: 'SQLite file' })
parser.add_argument('-pk', { help: 'Primary key' })

const args = parser.parse_args()
const table = String(args.table)
const file = String(args.file)
const pk = args.pk ? String(args.pk) : undefined

const reader = new Reader(process.stdin, { skipEmptyLines: true })

let columns: ColumnWithKey[] | undefined = undefined
let db: DB | undefined = undefined

const onLine = async (d: any) => {
  if (!db) {
    db = await initDb(file)
  }

  if (!columns) {
    columns = getColumns(d, pk)
    await db.createTable(table, columns)
  }

  await db.insert(
    table,
    [columns.reduce((r, { key, name }) => key ? { ...r, [name]: d[key] } : r, {})]
  )
}

reader.on('line', line => {
  reader.pause()
  onLine(JSON.parse(line))
    .then(() => reader.resume())
})

reader.on('end', () => {
  if (db) {
    db.saveFile()
    db.close()
  }
})
