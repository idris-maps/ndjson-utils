import { ArgumentParser } from 'argparse'
import { readFile } from 'fs'
import { promisify } from 'util'
import initDb from './sql'

const parser = new ArgumentParser({
  description: 'Stream SQLite query to JSON or NDJSON',
})

parser.add_argument('-q', '--query', { help: 'An SQL query' })
parser.add_argument('-qf', '--queryFile', { help: 'A .sql file with the query' })
parser.add_argument('-f', '--file', { required: true, help: 'SQLite file' })
parser.add_argument('-n', '--ndjson', { help: 'Return NDJSON (defaults to JSON)' })

const args = parser.parse_args()
const file = String(args.file)
const ndjson = Boolean(args.ndjson)

const getQuery = async (args: any) => {
  if (args.queryFile) { return await promisify(readFile)(String(args.queryFile), 'utf-8') }
  if (args.query) { return String(args.query) }
  return undefined
}

const noQueryMsg = `
  A query must be defined.

  * As an argument with "-q" or "--query"
  * As from a .sql file with "-qf" or "--queryFile"
`

const main = async () => {
  const query = await getQuery(args)
  if (!query) {
    return console.log(noQueryMsg)
  }

  const db = await initDb(file)
  const rows = await db.query(query)
  if (ndjson) {
    rows.forEach(d => console.log(JSON.stringify(d)))
  } else {
    console.log(JSON.stringify(rows))
  }
  db.close()
}

main()