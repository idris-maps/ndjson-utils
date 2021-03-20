import test from 'ava'
import getColumns from '../src/columnsFromJson'

const JSON = { a: 1, b: 'one' }

test('columnsFromJson', t => {
  const noPk = getColumns(JSON)
  t.is(noPk.find(d => d.name === 'a')?.type, 'NUMERIC')
  t.is(noPk.find(d => d.name === 'b')?.type, 'TEXT')
  t.truthy(noPk.find(d => d.name === 'id'), 'should add id if PK not defined')

  const withPk = getColumns(JSON, 'a')
  t.true(withPk.find(d => d.name === 'a')?.pk)
  t.is(withPk.find(d => d.name === 'a')?.type, 'INTEGER')

  const invalidColumnName = 'söme k?y'
  const withInvalidName = getColumns({ ...JSON, [invalidColumnName]: 1 })
  const col = withInvalidName.find(d => d.key === invalidColumnName)
  t.truthy(col)
  t.not(col?.key, col?.name)
})