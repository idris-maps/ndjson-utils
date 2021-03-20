import { ArgumentParser } from 'argparse'
import initDb from './sql'

const parser = new ArgumentParser({
  description: 'Stream SQLite query to JSON or NDJSON',
})

parser.add_argument('-q', '--query', { required: true, help: 'SELECT query' })
parser.add_argument('-f', '--file', { required: true, help: 'SQLite file' })
parser.add_argument('-n', '--ndjson', { help: 'Return NDJSON (defaults to JSON)' })

const args = parser.parse_args()
const query = String(args.query)
const file = String(args.file)
const ndjson = Boolean(args.ndjson)

const main = async () => {
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