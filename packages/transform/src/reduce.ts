import read from './read'

const result = process.argv[2]
const func = result ? eval(`(r, d, i) => (${result})`) : (r: any[], d: any) => [...r, d]

const initialValue = process.argv[3]
let value = initialValue ? JSON.parse(initialValue) : []

read(
  (d, i) => { value = func(value, d, i) },
  () => console.log(JSON.stringify(value))
)
