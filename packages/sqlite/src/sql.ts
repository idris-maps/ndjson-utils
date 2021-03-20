import initSql, { Database, QueryExecResult } from 'sql.js'
import { resolve } from 'path'
import { readFile, exists, writeFile } from 'fs'
import { promisify } from 'util'

const read = promisify(readFile)
const checkExists = promisify(exists)
const write = promisify(writeFile)

const parseResult = (res: QueryExecResult[]): any[] => {
  const { columns, values } = Array.from(res.values())[0]
  return values.map(row => columns.reduce((r, k, i) => ({ ...r, [k]: row[i]}), {}))
}

const query = (db: Database) =>
  async (query: string) => {
    try {
      const res = await db.exec(query)
      return parseResult(res)
    } catch (e) {
      return []
    }
  }

export interface Column {
  name: string
  type: 'TEXT' | 'NUMERIC' | 'INTEGER' | 'REAL' | 'BLOB',
  pk?: boolean
}

const prepareColumns = (columns: Column[]) => columns
  .map(d => `${d.name} ${d.type}${d.pk ? ' PRIMARY KEY' : ''}`)
  .join(',')

const createTable = (db: Database) =>
  async (table: string, columns: Column[]) =>
    db.run(['CREATE TABLE IF NOT EXISTS', table, '(', prepareColumns(columns), ')'].join(' '))

const prepareInsert = (table: string, obj: object) => [
  'INSERT INTO',
  table,
  '(',
  Object.keys(obj).join(','),
  ') VALUES (',
  Object.keys(obj).map(_ => '?').join(','),
  ')',
].join(' ')

const insert = (db: Database) =>
  (table: string, arr: any[]) =>
    Promise.all(
      arr.map(d => {
        const values = Object.keys(d).map(k => d[k])
        return db.run(prepareInsert(table, d), values)
      })
    )

export interface DB {
  saveFile: () => Promise<void>
  close: () => void
  createTable: (table: string, columns: Column[]) => Promise<Database>
  insert: (table: string, arr: object[]) => Promise<Database[]>
  query: (d: string) => Promise<any[]>
}

export default async (filePath: string): Promise<DB> => {
  const path = resolve(filePath)
  const dbExists = await checkExists(path)
  const sql = await initSql()
  const db = await (dbExists ? new sql.Database(await read(path)) : new sql.Database())

  return {
    saveFile: () => write(path, Buffer.from(db.export())),
    close: () => db.close(),
    createTable: createTable(db),
    insert: insert(db),
    query: query(db),
  }
}
