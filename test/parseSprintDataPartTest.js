import {parseSprintDataPart} from "../js/calculations.js";

QUnit.module('parseSprintDataPart');

QUnit.test('At least 1 story point planned', (assert) => {
    const plannedStoryPoints = '0';
    const sprintLength = '14';
    const sprintStart = new Date();
    sprintStart.setDate(sprintStart.getDate() + 1);
    assert.notOk(parseSprintDataPart(plannedStoryPoints, sprintLength, sprintStart));
});

QUnit.test('Sprint length is an integer from interval [1,999]', (assert) => {
    const plannedStoryPoints = '1';
    const sprintLength1 = '0';
    const sprintLength2 = '1000';
    const sprintLength3 = '999';
    const sprintStart = new Date();
    sprintStart.setDate(sprintStart.getDate() + 1);
    assert.notOk(parseSprintDataPart(plannedStoryPoints, sprintLength1, sprintStart));
    assert.notOk(parseSprintDataPart(plannedStoryPoints, sprintLength2, sprintStart));
    assert.deepEqual(parseSprintDataPart(plannedStoryPoints, sprintLength3, sprintStart), {
        'plannedStoryPoints': 1,
        'sprintLength': 999,
        'sprintStart': sprintStart
    });
});

QUnit.test('Sprint start is valid future date', (assert) => {
    const plannedStoryPoints = '1';
    const sprintLength = '999';
    const sprintStart1 = new Date();
    sprintStart1.setDate(sprintStart1.getDate() - 1);
    const sprintStart2 = new Date();
    const sprintStart3 = new Date();
    sprintStart3.setDate(sprintStart3.getDate() + 1);
    assert.notOk(parseSprintDataPart(plannedStoryPoints, sprintLength, sprintStart1));
    assert.deepEqual(parseSprintDataPart(plannedStoryPoints, sprintLength, sprintStart2), {
        'plannedStoryPoints': 1,
        'sprintLength': 999,
        'sprintStart': sprintStart2
    });
    assert.deepEqual(parseSprintDataPart(plannedStoryPoints, sprintLength, sprintStart3), {
        'plannedStoryPoints': 1,
        'sprintLength': 999,
        'sprintStart': sprintStart3
    });
});

