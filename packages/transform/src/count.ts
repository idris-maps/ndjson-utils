import read from './read'

let count = 0

read(
  d => { count = count + 1 },
  () => console.log(count)
)
