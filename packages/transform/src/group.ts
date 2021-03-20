import read from './read'

const result = process.argv[2]
const func = eval(`(d, i) => (${result})`)

const groups = new Map<any, any[]>()

read(
  (d, i) => {
    const key = func(d, i)
    const currentGroup = groups.get(key) || []
    groups.set(key, [...currentGroup, d])
  },
  () => {
    for (const value of groups.values()) {
      console.log(JSON.stringify(value))
    }
  }
)