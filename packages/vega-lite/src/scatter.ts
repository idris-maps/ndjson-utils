import { ArgumentParser } from 'argparse'
import { TopLevelSpec } from 'vega-lite'
import logSpec from './logSpec'

const parser = new ArgumentParser({
  description: 'Create a bar chart from JSON or NDJSON',
})

parser.add_argument('-x', { help: 'X axis key', required: true })
parser.add_argument('-y', { help: 'Y axis key', required: true })
parser.add_argument('-W', '--width', { help: 'Chart width (defaults to "400")' })
parser.add_argument('-H', '--height', { help: 'Chart height (defaults to "400")' })
parser.add_argument('-n', '--ndjson', { help: 'Takes a NDJSON stream (defaults to JSON)' })

const args = parser.parse_args()

interface Config {
  x: string
  y: string
  width: string
  height: string
}

const config: Config = {
  x: args.x || 'label',
  y: args.y || 'value',
  width: args.width || '400',
  height: args.height || '400',
}

const getSpec = (data: any): TopLevelSpec => ({
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": Number(config.width),
  "height": Number(config.height),
  "data": {
    "values": data,
  },
  "mark": "point",
  "encoding": {
    "x": {"field": config.x, "type": "quantitative" },
    "y": {"field": config.y, "type": "quantitative"},
  }
})

logSpec(Boolean(args.ndjson), getSpec)
