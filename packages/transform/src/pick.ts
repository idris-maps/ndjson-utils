import read from './read'

const keys = (process.argv[2] || '').split(',').map(d => d.trim())
const pick = (d: any) => keys.reduce((r, key) => ({ ...r, [key]: d[key] }), {})

read((d) => {
  console.log(JSON.stringify(pick(d)))
})
