import read from './read'

read((d) => console.log(
  JSON.stringify(
    Object.keys(d).map(key => [key, d[key]])
  )
))
