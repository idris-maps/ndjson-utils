import read from './read'

const result = process.argv[2]
const func = eval(`(d, i) => (${result})`)

read((d, i) => {
  if (func(d, i)) {
    console.log(JSON.stringify(d))
  }
})
