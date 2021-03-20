import readline from 'readline'
import { TopLevelSpec } from 'vega-lite'

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

const main = async (isNdjson: boolean, getSpec: (d: any[]) => TopLevelSpec) => {
  try {
    const data = await (isNdjson ? handleNdjson() : handleJson())
    console.log(JSON.stringify(getSpec(data)))
  } catch (e) {
    throw e
  }
}

export default main

