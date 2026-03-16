import test from 'node:test';
import assert from 'node:assert/strict';

import { buildRequirementStatusMap } from './planner.js';

function makeItem(overrides = {}) {
  return {
    id: 'TEST1000',
    name: 'Test Unit',
    year: 1,
    semester: 1,
    credit: 6,
    P: '',
    C: '',
    N: '',
    ignore_warning: false,
    ...overrides,
  };
}

test('blank requirements stay satisfied', () => {
  const status = buildRequirementStatusMap([makeItem()]).get('TEST1000');

  assert.equal(status.pState, 'met');
  assert.equal(status.cState, 'met');
  assert.equal(status.nState, 'met');
  assert.equal(status.hasConflict, false);
  assert.equal(status.needsReview, false);
});

test('credit-point wildcard prerequisites can be evaluated', () => {
  const items = [
    makeItem({ id: 'MATH2021', name: 'Math 2021', year: 1, semester: 1 }),
    makeItem({ id: 'MATH2022', name: 'Math 2022', year: 1, semester: 2 }),
    makeItem({
      id: 'MATH3061',
      name: 'Math 3061',
      year: 2,
      semester: 1,
      P: '12 credit points of MATH2XXX',
    }),
  ];

  const status = buildRequirementStatusMap(items).get('MATH3061');
  assert.equal(status.pState, 'met');
  assert.equal(status.hasConflict, false);
});

test('credit selectors without explicit parentheses still count matching units', () => {
  const items = [
    makeItem({ id: 'BIOL1001', name: 'Biology 1001', year: 1, semester: 1 }),
    makeItem({
      id: 'NEUR2001',
      name: 'Neuroscience 2001',
      year: 1,
      semester: 2,
      P: '6 credit points from BIOL1XXX or MEDS1X01 or PSYC1002',
    }),
  ];

  const status = buildRequirementStatusMap(items).get('NEUR2001');
  assert.equal(status.pState, 'met');
  assert.equal(status.hasConflict, false);
});

test('grade-based clauses fall back to manual review instead of hard failure', () => {
  const items = [
    makeItem({ id: 'MATH2061', name: 'Math 2061', year: 1, semester: 1 }),
    makeItem({
      id: 'MATH3962',
      name: 'Math 3962',
      year: 1,
      semester: 2,
      P: 'MATH2961 or MATH2922 OR a mark of 65 OR greater in (MATH2061 or MATH2022)',
    }),
  ];

  const status = buildRequirementStatusMap(items).get('MATH3962');
  assert.equal(status.pState, 'review');
  assert.equal(status.hasConflict, false);
  assert.equal(status.needsReview, true);
});

test('advisory text after prohibitions does not hide real conflicts', () => {
  const items = [
    makeItem({ id: 'VIRO3901', name: 'Virology 3901', year: 1, semester: 1 }),
    makeItem({
      id: 'VIRO3001',
      name: 'Virology 3001',
      year: 1,
      semester: 2,
      N: 'VIRO3901 Students are strongly advised to complete VIRO3001 or VIRO3901 before enrolling in VIRO3002 or VIRO3902.',
    }),
  ];

  const status = buildRequirementStatusMap(items).get('VIRO3001');
  assert.equal(status.nState, 'unmet');
  assert.equal(status.hasConflict, true);
});
