import {parseInputToIntArray} from "../js/calculations.js";

QUnit.module('parseInputToIntArray');

QUnit.test('Separated by multiple spaces', (assert) => {
    const input = '   1      2 3    4  8 12  ';
    const expected = [1, 2, 3, 4, 8, 12];
    assert.deepEqual(parseInputToIntArray(input), expected);
});

QUnit.test('Separated by exactly one space', (assert) => {
    const input = '1 2 3 4 8 12';
    const expected = [1, 2, 3, 4, 8, 12];
    assert.deepEqual(parseInputToIntArray(input), expected);
});

QUnit.test('Empty', (assert) => {
    const input = '  ';
    const expected = [];
    assert.deepEqual(parseInputToIntArray(input), expected);
});

QUnit.test('Invalid input values', (assert) => {
    assert.notOk(parseInputToIntArray('a'));
    assert.notOk(parseInputToIntArray('.'));
    assert.notOk(parseInputToIntArray('?'));
    assert.notOk(parseInputToIntArray(']'))
    assert.notOk(parseInputToIntArray('9a9'));
});