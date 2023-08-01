import {parseVelocitiesPart} from "../js/calculations.js";

QUnit.module('parseVelocitiesPart');

QUnit.test('At least 5 values need to be provided', (assert) => {
    const input = '5 4 5 7 ';
    assert.notOk(parseVelocitiesPart(input, false, null));
});

QUnit.test('Max 1000 values can be provided', (assert) => {
    const randomIntegersArray = [];
    for (let i = 0; i < 1001; i++) {
        const randomInteger = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
        randomIntegersArray.push(randomInteger);
    }
    assert.notOk(parseVelocitiesPart(randomIntegersArray.toString(), false, null));
});

QUnit.test('Valid velocities without newTeamCapacityValue', (assert) => {
    const input1 = '12 21   21\n 12 14';
    const input2 = '21 12 14    45 12'
    assert.deepEqual(parseVelocitiesPart(input1, false, null), [12, 21, 21, 12, 14]);
    assert.deepEqual(parseVelocitiesPart(input2, false, null), [21, 12, 14, 45, 12]);
});

QUnit.test('Invalid newTeamCapacityValue', (assert) => {
    const input = '12 21 \n 12 14 \n 12 14 \n 12 14 \n 12 14';
    assert.notOk(parseVelocitiesPart(input, true, 0.1));
    assert.notOk(parseVelocitiesPart(input, true, 'a'));
});

QUnit.test('Valid newTeamCapacityValue', (assert) => {
    const input = '12 21 \n 10 11 \n 12 7 \n 10 11 \n 12 10';
    const newTeamCapacityValue = 11;
    assert.deepEqual(parseVelocitiesPart(input, true, newTeamCapacityValue), [6.29, 10, 18.86, 10, 13.2]);
});