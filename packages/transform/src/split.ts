import { readFile } from 'fs';
import { promisify } from 'util';

const file = process.argv[2]
const path = process.argv[3]

const walkPath = (path: string[], d: any): any => {
  const [first, ...rest] = path
  if (rest.length === 0) {
    return d[first]
  } else {
    return walkPath(rest, d[first] || {})
  }
}

const main = async (file: string, path: string) => {
  const content = await promisify(readFile)(file, 'utf-8')
  const json = JSON.parse(content)
  const arr = path ? walkPath(path.split('.'), json) : json
  if (!Array.isArray(arr)) {
    throw new Error(`${path ? path : file} is not an array`)
  }
  arr.forEach(d => console.log(JSON.stringify(d)))
}

main(file, path)