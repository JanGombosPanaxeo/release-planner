import {parseTextareaRows} from "../js/calculations.js";

QUnit.module('parseTextareaRows');

QUnit.test('Separated by multiple spaces', (assert) => {
    const input = '  12  10  \n 15    12  ';
    const expected = [[12,10],[15,12]];
    assert.deepEqual(parseTextareaRows(input), expected);
});

QUnit.test('Separated by multiple spaces or commas', (assert) => {
    const input = '  12  10  \n 15   ,, 12\n12,12  ';
    const expected = [[12,10],[15,12],[12,12]];
    assert.deepEqual(parseTextareaRows(input), expected);
});

QUnit.test('Separated by exactly one space or comma', (assert) => {
    const input1 = '12 10\n15 12\n12 12';
    const input2 = '12,10\n15,12\n12,12';
    const expected = [[12,10],[15,12],[12,12]];
    assert.deepEqual(parseTextareaRows(input1), expected);
    assert.deepEqual(parseTextareaRows(input2), expected);
});

QUnit.test('More or less than 2 values per row', (assert) => {
    const input1 = '12 10 11\n15 12\n12 12';
    const input2 = '12,10\n15\n12,12';
    assert.notOk(parseTextareaRows(input1));
    assert.notOk(parseTextareaRows(input2));
});

QUnit.test('Invalid values', (assert) => {
    const input1 = '12 10 \n15 12\n12 a';
    const input2 = '12 10 \n15 12\n12 .';
    const input3 = '12 10 \n15 12\n12 /';
    const input4 = '12 10 \n15 12\n12 7a7';
    const input5 = '12 10 \n15 12\n12 !';
    const input6 = '12 10 \n15 12\n12 "';
    assert.notOk(parseTextareaRows(input1));
    assert.notOk(parseTextareaRows(input2));
    assert.notOk(parseTextareaRows(input3));
    assert.notOk(parseTextareaRows(input4));
    assert.notOk(parseTextareaRows(input5));
    assert.notOk(parseTextareaRows(input6));
});