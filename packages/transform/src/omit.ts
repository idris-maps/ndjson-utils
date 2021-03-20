import read from './read'

const keys = (process.argv[2] || '').split(',').map(d => d.trim())
const omit = (d: any) => Object.keys(d)
  .reduce((r, key) => keys.includes(key) ? r : { ...r, [key]: d[key] }, {})

read((d) => {
  console.log(JSON.stringify(omit(d)))
})
