import read from './read'

const keys = (process.argv[2] || '').split(',').map(d => d.trim())
const cast = (d: any) => keys.reduce((r, key) => ({ ...r, [key]: Number(r[key]) }), d)

read((d) => {
  console.log(JSON.stringify(cast(d)))
})
