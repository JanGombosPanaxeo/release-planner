import {addDaysToDate, isValidDateInFuture} from "./utils.js";

const providedValues = {
    velocities: [1,2,3,4,5],
    teamCapacity: [],
    workEstimation: [50,80]
}

export const errorObj = {
    errorHasOccurred: false,
    errorMessage: null
}

const resetProvidedValues = () => {
    providedValues.velocities = [];
    providedValues.teamCapacity = [];
    providedValues.workEstimation = [];
}

const resetErrorObj = () => {
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

const parseInputToIntArray = (strInput) => {
    resetErrorObj();
    let inputArray = strInput.split(/\s|,\s*/);// Split by comma or space
    inputArray = inputArray.filter(word => word !== '');
    const parsedArray = inputArray.map(element => parseInt(element, 10));
    for (const [index, val] of parsedArray.entries()) {
        if (isNaN(val)) {
            setError('Unable to parse value at position ' + (index + 1) + ' :(')
            return;
        }
    }
    return inputArray;
}

export const parseVelocitiesFormInput = (strInput) => {
    const intValues = parseInputToIntArray(strInput);
    if (errorObj.errorHasOccurred) {
        return;
    }
    if (intValues.length < 5) {
        setError("You need to provide at least 5 values");
        return;
    } else if (intValues.length > 1000) {
        setError("Maximum number of values is 1000");
        return;
    }
    return intValues;
}

export const parseTeamCapacityFormInput = (strInput) => {
    const intValues = parseInputToIntArray(strInput);
    if (errorObj.errorHasOccurred) {
        return;
    }
    if (intValues.length !== 2 && intValues.length !== 0) {
        setError("You need to provide exactly 0 or 2 values");
        return;
    }
    if (intValues.some((elem) => elem < 1 || elem > 9999)) {
        setError("Each value must be an integer from interval [1,9999]");
        return;
    }
    return intValues;
}

export const parseWorkEstimationFormInput = (strInput) => {
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

export const parseSprintDataFormInput = (sprintDataForm) => {
    resetErrorObj();
    const plannedStoryPoints = sprintDataForm.find('#plannedStoryPoints').val();
    const sprintLength = sprintDataForm.find('#sprintLength').val();
    const sprintStart = sprintDataForm.find('#sprintStart').val();
    if (plannedStoryPoints < 1) {
        setError("You need to plan at least 1 story point for your next sprint");
        return;
    } else if (sprintLength < 1 || sprintLength > 999) {
        setError("Sprint length must be an integer from interval [1,999]");
        return;
    } else if (!isValidDateInFuture(sprintStart)) {
        setError("Sprint start must be an valid date in the future (including today)");
        return;
    }
    return {plannedStoryPoints, sprintLength, sprintStart};
}

export const calcVelocities = (strInput) => {
    const velocities = parseVelocitiesFormInput(strInput);
    if (errorObj.errorHasOccurred) return;
    providedValues.velocities = velocities;
}

export const calcTeamCapacity = (strInput) => {
    const teamCapacity = parseTeamCapacityFormInput(strInput);
    if (errorObj.errorHasOccurred) return;
    providedValues.teamCapacity = teamCapacity;
}

export const calcWorkEstimation = (strInput) => {
    const workEstimation = parseWorkEstimationFormInput(strInput);
    if (errorObj.errorHasOccurred) return;
    providedValues.workEstimation = workEstimation;
}

export const forecast = (sprintDataForm) => {
    const {plannedStoryPoints, sprintLength, sprintStart} = parseSprintDataFormInput(sprintDataForm) || {};
    if (errorObj.errorHasOccurred) return;
    let velocities = [...providedValues.velocities];
    let Vmin, Vmax;
    let sprintsMin, sprintsMax;
    let [Emin, Emax] = providedValues.workEstimation;
    let [SPmin, SPmax] = [plannedStoryPoints / Emin, plannedStoryPoints / Emax];
    let removeHighest = true;
    velocities.sort();

    while (velocities.length > 6) {
        if (removeHighest) velocities.pop();
        else velocities.shift();
        removeHighest = !removeHighest;
    }
    Vmin = velocities[0];
    Vmax = velocities[velocities.length - 1]
    sprintsMin = SPmin / Vmax;
    sprintsMax = SPmax / Vmin;
    console.log("spmin", SPmin)
    console.log("vmax", Vmax)
    console.log("spmax", sprintsMax)
    console.log("splength", sprintLength)
    const dateMin = addDaysToDate(new Date(sprintStart), Math.round(sprintsMin * sprintLength));
    const dateMax = addDaysToDate(new Date(sprintStart), Math.round(sprintsMax * sprintLength));
    return {dateMin, dateMax};
}