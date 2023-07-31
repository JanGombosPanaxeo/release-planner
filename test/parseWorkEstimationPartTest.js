import {parseWorkEstimationPart} from "../js/calculations.js";

QUnit.module('parseWorkEstimationPart');

QUnit.test('More or less than 2 values', (assert) => {
    const input1 = '1 2 4';
    const input2 = '1 2 4 5 8 777';
    const input3 = '1';
    const input4 = '';
    assert.notOk(parseWorkEstimationPart(input1));
    assert.notOk(parseWorkEstimationPart(input2));
    assert.notOk(parseWorkEstimationPart(input3));
    assert.notOk(parseWorkEstimationPart(input4));
});

QUnit.test('Not valid values', (assert) => {
    const input1 = 'a 2';
    const input2 = '1 7a7';
    const input3 = '2 ? ';
    assert.notOk(parseWorkEstimationPart(input1));
    assert.notOk(parseWorkEstimationPart(input2));
    assert.notOk(parseWorkEstimationPart(input3));
});

QUnit.test('Separated by commas or spaces', (assert) => {
    const input1 = '8 ,2';
    const input2 = ' 12     7    ';
    const input3 = '2 ,, 55    ';
    assert.deepEqual(parseWorkEstimationPart(input1),[8,2]);
    assert.deepEqual(parseWorkEstimationPart(input2),[12,7]);
    assert.deepEqual(parseWorkEstimationPart(input3),[2,55]);
});

QUnit.test('Each value must be an integer from interval [0,100]', (assert) => {
    const input1 = '0,100';
    const input2 = '10,10';
    const input3 = '50,80';
    const input4 = '60,40';
    const input5 = '-5 50';
    const input6 = '0 150';
    const input7 = '120 150';
    const input8 = '0 -1';
    assert.deepEqual(parseWorkEstimationPart(input1),[0,100]);
    assert.deepEqual(parseWorkEstimationPart(input2),[10,10]);
    assert.deepEqual(parseWorkEstimationPart(input3),[50,80]);
    assert.deepEqual(parseWorkEstimationPart(input4),[60,40]);
    assert.notOk(parseWorkEstimationPart(input5));
    assert.notOk(parseWorkEstimationPart(input6));
    assert.notOk(parseWorkEstimationPart(input7));
    assert.notOk(parseWorkEstimationPart(input8));
});
