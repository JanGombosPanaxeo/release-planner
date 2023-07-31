import {forecast, providedValues} from "../js/calculations.js";

QUnit.module('forecast');

QUnit.test('Correct calculation', (assert) => {
    providedValues.velocities = [14, 12, 16, 9, 15, 13, 21, 18, 11, 15];
    providedValues.workEstimation = [0.7,0.8];
    const plannedStoryPoints = '100';
    const sprintLength = '14';
    const sprintStart = new Date();
    sprintStart.setDate(sprintStart.getDate() + 1);
    const expectedMinDate = new Date(sprintStart);
    expectedMinDate.setDate(expectedMinDate.getDate() + (parseInt(sprintLength,10) * 8));
    const expectedMaxDate = new Date(sprintStart);
    expectedMaxDate.setDate(expectedMaxDate.getDate() + (parseInt(sprintLength,10) * 12));
    const {dateMin, dateMax} = forecast(plannedStoryPoints,sprintLength,sprintStart);
    assert.equal(dateMin.getTime(), expectedMinDate.getTime());
    assert.equal(dateMax.getTime(), expectedMaxDate.getTime());
});