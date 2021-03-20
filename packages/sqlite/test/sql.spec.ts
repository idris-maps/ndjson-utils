import test from 'ava'
import initDb, { Column } from '../src/sql'
import { exists, unlink } from 'fs'
import { promisify } from 'util'

const removeFile = promisify(unlink)
const checkExists = promisify(exists)

const FILE = 'test/test.sqlite'
const COLUMNS: Column[] = [
  { name: 'a', type: 'INTEGER' },
  { name: 'b', type: 'TEXT' },
]
const ROWS = [
  { a: 1, b: 'one' },
  { a: 2, b: 'two' },
]
const table = (d: number) => `test_${d}`

test.after(() => removeFile(FILE))

test('initDb', async t => {
  const db = await initDb(FILE)

  await db.createTable(table(1), COLUMNS)
  const tables = await db.query('SELECT name FROM sqlite_master WHERE type = "table"')
  t.true(tables.map(d => d.name).includes(table(1)), 'should create table')

  await db.insert(table(1), ROWS)
  const rows = await db.query(`SELECT * FROM ${table(1)}`)
  t.deepEqual(rows, ROWS, 'should insert and retrieve rows')

  await db.saveFile()
  t.true(await checkExists(FILE), 'should create file')
})