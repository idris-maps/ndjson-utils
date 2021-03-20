import read from './read'

const key = process.argv[2]

let sum = 0

read(
  d => {
    const num = Number(d[key])
    sum = sum + (Number.isNaN(num) ? 0 : num)
  },
  () => console.log(sum)
)
