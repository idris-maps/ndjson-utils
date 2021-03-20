import read from './read'

const result = process.argv[2]
const func = eval(`(d, i) => (${result})`)

read((d, i) => {
  console.log(JSON.stringify(func(d, i)))
})
