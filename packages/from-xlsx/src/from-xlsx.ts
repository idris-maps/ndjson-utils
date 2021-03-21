import { readFile, utils } from 'xlsx'
import { ArgumentParser } from 'argparse'

const parser = new ArgumentParser({
  description: 'Stream NDJSON or JSON from an excel file',
})

parser.add_argument('-f', '--file', { required: true, help: 'The .xlsx file' })
parser.add_argument('-s', '--sheet', { required: true, help: 'The sheet name' })
parser.add_argument('-n', '--ndjson', { help: 'Return NDJSON (defaults to JSON)' })

const args = parser.parse_args()
const file = String(args.file)
const sheet = String(args.sheet)
const ndjson = Boolean(args.ndjson)

const xlsxFile = readFile(file)

const json = utils.sheet_to_json(xlsxFile.Sheets[sheet])

if (ndjson) {
  json.forEach(d => console.log(JSON.stringify(d)))
} else {
  console.log(JSON.stringify(json))
}
