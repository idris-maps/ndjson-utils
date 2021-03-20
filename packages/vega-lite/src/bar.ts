import { ArgumentParser } from 'argparse'
import { TopLevelSpec } from 'vega-lite'
import readline from 'readline'

const parser = new ArgumentParser({
  description: 'Create a bar chart from JSON or NDJSON',
})

parser.add_argument('-x', { help: 'X axis key (defaults to "label")' })
parser.add_argument('-y', { help: 'Y axis key (defaults to "value")' })
parser.add_argument('-W', '--width', { help: 'Chart width (defaults to "400")' })
parser.add_argument('-H', '--height', { help: 'Chart height (defaults to "200")' })
parser.add_argument('-c', '--color', { help: 'Bar color (defaults to "steelblue")' })
parser.add_argument('-n', '--ndjson', { help: 'Takes a NDJSON stream (defaults to JSON)' })

const args = parser.parse_args()

interface Config {
  x: string
  y: string
  width: string
  height: string
  color: string
}

const config: Config = {
  x: args.x || 'label',
  y: args.y || 'value',
  width: args.width || '400',
  height: args.height || '200',
  color: args.color || 'steelblue'
}

const getSpec = (data: any): TopLevelSpec => ({
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": Number(config.width),
  "height": Number(config.height),
  "data": {
    "values": data,
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": config.x, "type": "ordinal" },
    "y": {"field": config.y, "type": "quantitative"},
    "color": { "value": config.color }
  }
})

const isNdjson = Boolean(args.ndjson)

const handleNdjson = (): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const reader = readline.createInterface(process.stdin)

    let data: any[] = []
    reader.on('line', d => { try { data.push(JSON.parse(d)) } catch (e) { reject(e) }})

    reader.on('close', () => resolve(data))
  })

const handleJson = (): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const reader = readline.createInterface(process.stdin)

    let data = ''
    reader.on('line', d => data = data + d)

    reader.on('close', () => { try { resolve(JSON.parse(data)) } catch (e) { reject(e) }  })
  })

const main = async () => {
  try {
    const data = await (isNdjson ? handleNdjson() : handleJson())
    console.log(JSON.stringify(getSpec(data)))
  } catch (e) {
    throw e
  }
}

main()