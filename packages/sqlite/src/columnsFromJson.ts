import { Column } from './sql'

export interface ColumnWithKey extends Column {
  key?: string
}

const getIdKey = (keys: string[], key: string): string =>
  keys.includes(key)
    ? getIdKey(keys, '_' + key)
    : key

const isNum = (d: any): d is number => typeof(d) === 'number'
const isInt = (d: number): boolean => Math.floor(d) === d

const allowedKeyChars = 'abcdefghijklmnopqrstuvwxyz1234567890_'
const fixKey = (d: string) => Array.from(d)
  .map(char => allowedKeyChars.includes(char) ? char : '_')
  .join('')

const getColumns = (o: any, pk?: string): ColumnWithKey[] =>
  Object.keys(o)
    .map(k => {
      const value = o[k]
      const name = fixKey(k)
      const type = isNum(value)
        ? k === pk && isInt(value) ? 'INTEGER' : 'NUMERIC'
        : 'TEXT'
      return { key: k, name, type, pk: k === pk }
    })

export default (o: any, pk?: string): ColumnWithKey[] => {
  const columns = getColumns(o, pk)
  return columns.filter(d => d.pk).length === 0
    ? [{ name: getIdKey(Object.keys(o), 'id'), type: 'INTEGER', pk: true }, ...columns]
    : columns
}
