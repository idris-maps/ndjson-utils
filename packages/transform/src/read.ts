import readline from 'readline'

const parse = (d: string) => {
  try {
    return JSON.parse(d)
  } catch (e) {
    return {}
  }
}

export default (
  onLine: (d: any, i: number) => void,
  onClose?: () => void,
) => {
  const reader = readline.createInterface(process.stdin)
  let i = -1

  reader.on('line', d => {
    i = i + 1
    onLine(parse(d), i)
  })

  reader.on('close', () => {
    if (onClose) { onClose() }
  })
}
