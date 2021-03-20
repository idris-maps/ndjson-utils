import read from './read'

const result = process.argv[2]
const func = result ? eval(`(d, i) => (${result})`) : undefined

const exists = new Map<string, any>()

read(
  (d, i) => {
    const key = JSON.stringify(func ? func(d, i) : d)
    if (!exists.has(key)) {
      exists.set(key, 1)
      console.log(JSON.stringify(d))
    }
  }
)