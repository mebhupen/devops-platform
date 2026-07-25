
const { parsePagination, buildMeta } = require('../../../src/utils/pagination');
test('parsePagination defaults', () => {
  const p = parsePagination({});
  expect(p.page).toBe(1);
  expect(p.limit).toBe(10);
});
test('buildMeta', () => {
  const m = buildMeta(100, 2, 10);
  expect(m.totalPages).toBe(10);
  expect(m.hasNext).toBe(true);
});
