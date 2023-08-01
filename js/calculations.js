import {addDaysToDate, isValidDateInFuture, safeParseToInt} from "./utils.js";

export const providedValues = {
    velocities: [],
    workEstimation: []
}

export const errorObj = {
    errorHasOccurred: false,
    errorMessage: null
}

export const resetProvidedValues = () => {
    providedValues.velocities = [];
    providedValues.workEstimation = [];
}

export const resetErrorObj = () => {
    errorObj.errorHasOccurred = false;
    errorObj.errorMessage = null;
}

const setError = (message) => {
    errorObj.errorHasOccurred = true;
    errorObj.errorMessage = message;
}

export function refreshForm() {
    if (errorObj.errorHasOccurred) {
        $("#warning-data-error").text(errorObj.errorMessage);
        $("#warning-data-fmt").show();
    } else $("#warning-data-fmt").hide();
}

export const parseInputToIntArray = (strInput) => {
    resetErrorObj();
    let inputArray = strInput.split(/\s|,\s*/);// Split by comma or space
    inputArray = inputArray.filter(word => word !== '');
    const parsedArray = inputArray.map(element => safeParseToInt(element));
    for (const [index, val] of parsedArray.entries()) {
        if (isNaN(val)) {
            setError('Unable to parse value at position ' + (index + 1) + ' :(');
            return;
        }
    }
    return parsedArray;
}

export const parseTextareaRows = (strInput) => {
    resetErrorObj();
    const inputText = strInput.trim();
    const rows = inputText.split("\n");
    const parsedValues = [];

    for (const [index, row] of rows.entries()) {
        const values = row.trim().split(/\s|,\s*/).filter(word => word !== '');
        if (values.length === 2) {
            const num1 = safeParseToInt(values[0]);
            const num2 = safeParseToInt(values[1]);
            // Check if both values are valid integers
            if (!isNaN(num1) && !isNaN(num2)) {
                parsedValues.push([num1, num2]); // Store the parsed integers as a pair
            } else {
                setError('Unable to parse value at row ' + (index + 1) + ' :(');
                return;
            }
        } else {
            setError('Each row must contain exactly 2 values');
            return;
        }
    }
    return parsedValues;
}

export const parseVelocitiesPart = (strInput, newTeamCapacityValueChecked, newTeamCapacityValue) => {
    const values = newTeamCapacityValueChecked ? parseTextareaRows(strInput) : parseInputToIntArray(strInput);
    console.log(values);
    if (errorObj.errorHasOccurred) {
        return;
    }
    if (values.length < 5) {
        setError("You need to provide values for at least 5 sprints");
        return;
    } else if (values.length > 1000) {
        setError("Maximum number of sprints is 1000");
        return;
    } else if (newTeamCapacityValueChecked && (isNaN(newTeamCapacityValue) || newTeamCapacityValue < 1)) {
        setError("New team capacity value must be an positive integer");
        return;
    }
    return newTeamCapacityValue ? values.map(tuple => +((tuple[0] / tuple[1]) * newTeamCapacityValue).toFixed(2)) : values;
}
export const parseWorkEstimationPart = (strInput) => {
    const intValues = parseInputToIntArray(strInput);
    if (errorObj.errorHasOccurred) {
        return;
    }
    if (intValues.length !== 2) {
        setError("You need to provide exactly 2 values");
        return;
    }
    if (intValues.some((elem) => elem < 0 || elem > 100)) {
        setError("Each value must be an integer from interval [0,100]");
        return;
    }
    return intValues;
}

export const parseSprintDataPart = (plannedStoryPointsValue, sprintLengthValue, sprintStartValue) => {
    resetErrorObj();
    const plannedStoryPoints = safeParseToInt(plannedStoryPointsValue);
    const sprintLength = safeParseToInt(sprintLengthValue);
    const sprintStart = sprintStartValue
    if (isNaN(plannedStoryPoints) || plannedStoryPoints < 1) {
        setError("You need to plan at least 1 story point for your next sprint");
        return;
    } else if (isNaN(sprintLength) || sprintLength < 1 || sprintLength > 999) {
        setError("Sprint length must be an integer from interval [1,999]");
        return;
    } else if (!isValidDateInFuture(sprintStart)) {
        setError("Sprint start must be an valid date in the future (including today)");
        return;
    }
    return {plannedStoryPoints, sprintLength, sprintStart: new Date(sprintStart)};
}

export const calcVelocities = (strInput, newTeamCapacityValueChecked, newTeamCapacityValue) => {
    const velocities = parseVelocitiesPart(strInput, newTeamCapacityValueChecked, newTeamCapacityValue);
    if (errorObj.errorHasOccurred) return;
    providedValues.velocities = velocities;
}

export const calcWorkEstimation = (strInput) => {
    const workEstimation = parseWorkEstimationPart(strInput);
    if (errorObj.errorHasOccurred) return;
    //Divide work estimation by 100 as provided values are percentages in range 1-100
    providedValues.workEstimation = workEstimation.map(workEst => workEst / 100);

}

export const forecast = (plannedStoryPointsValue, sprintLengthValue, sprintStartValue) => {
    const {
        plannedStoryPoints,
        sprintLength,
        sprintStart
    } = parseSprintDataPart(plannedStoryPointsValue, sprintLengthValue, sprintStartValue) || {};
    if (errorObj.errorHasOccurred) return;
    let velocities = [...providedValues.velocities];
    let Vmin, Vmax;
    let sprintsMin, sprintsMax;
    let [Emin, Emax] = providedValues.workEstimation;

    //Calculate <Vmin, Vmax>
    let removeHighest = true;
    velocities.sort((a, b) => a - b);
    while (velocities.length > 6) {
        if (removeHighest) velocities.pop();
        else velocities.shift();
        removeHighest = !removeHighest;
    }
    Vmin = velocities[0];
    Vmax = velocities[velocities.length - 1]

    //Calculate duration range
    let [SPmin, SPmax] = [Math.round(plannedStoryPoints / Emax), Math.round(plannedStoryPoints / Emin)];
    sprintsMin = Math.ceil(SPmin / Vmax);
    sprintsMax = Math.ceil(SPmax / Vmin);
    const dateMin = addDaysToDate(sprintStart, Math.round(sprintsMin * sprintLength));
    const dateMax = addDaysToDate(sprintStart, Math.round(sprintsMax * sprintLength));
    return {dateMin, dateMax};
}