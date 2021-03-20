import { ArgumentParser } from 'argparse'
import { TopLevelSpec } from 'vega-lite'
import logSpec from './logSpec'

const parser = new ArgumentParser({
  description: 'Create a bar chart from JSON or NDJSON',
})

parser.add_argument('-l', '--label', { help: 'X axis key (defaults to "label")' })
parser.add_argument('-v', '--value', { help: 'Y axis key (defaults to "value")' })
parser.add_argument('-W', '--width', { help: 'Chart width (defaults to "400")' })
parser.add_argument('-H', '--height', { help: 'Chart height (defaults to "200")' })
parser.add_argument('-n', '--ndjson', { help: 'Takes a NDJSON stream (defaults to JSON)' })

const args = parser.parse_args()

interface Config {
  label: string
  value: string
  width: string
  height: string
}

const config: Config = {
  label: args.label || 'label',
  value: args.value || 'value',
  width: args.width || '400',
  height: args.height || '200',
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
    "x": {"field": config.label, "type": "ordinal" },
    "y": {"field": config.value, "type": "quantitative"},
  }
})

logSpec(Boolean(args.ndjson), getSpec)
