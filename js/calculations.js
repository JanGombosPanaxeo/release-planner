const providedValues = {
    velocities: [],
    teamCapacity: null
}

export const errorObj = {
    errorHasOccurred: false,
    errorMessage: null
}

const resetProvidedValues = () => {
    providedValues.velocities = [];
    providedValues.teamCapacity = null;
}

const resetErrorObj = () => {
    errorObj.errorHasOccurred = false;
    errorObj.errorMessage = null;
}

const setError = (message) => {
    errorObj.errorHasOccurred = true;
    errorObj.errorMessage = message;
}

export function refreshForm(){
    console.log(errorObj.errorHasOccurred)
    if(errorObj.errorHasOccurred){
        $("#warning-data-error").text(errorObj.errorMessage);
        $("#warning-data-fmt").show();
    } else $("#warning-data-fmt").hide();
}

const parseInputToIntArray = (strInput) => {
    resetErrorObj();
    let inputArray = strInput.split(/\s|,\s*/);// Split by comma or space
    inputArray = inputArray.filter(word => word !== '');
    const parsedArray = inputArray.map(element => parseInt(element, 10));
    for (const {index,val} in parsedArray.entries()){
        if(isNaN(val)){
            setError('Unable to parse value at position ' + index+1 + ':(')
            return;
        }
    }
    return inputArray;
}

export const parseVelocitiesFormInput = (strInput) => {
    const intValues = parseInputToIntArray(strInput);
    if(errorObj.errorHasOccurred){
        return;
    }
    if(intValues.length < 5){
        setError("You need to provide at least 5 values");
        return;
    }else if(intValues.length > 1000){
        setError("Maximum number of values is 1000");
        return;
    }
    return intValues;
}

export const parseTeamCapacityFormInput = (strInput) => {
    const intValues = parseInputToIntArray(strInput);
    if(errorObj.errorHasOccurred){
        return;
    }
    if(intValues.length !== 2){
        setError("You need to provide exactly 2 values");
        return;
    }
    if(intValues.some((elem) => elem < 1 || elem > 9999)){
        setError("Each value must be an integer from interval [1,9999]");
        return;
    }
    return intValues;
}

export const calcVelocities = (strInput) => {
    const velocities = parseVelocitiesFormInput(strInput);
    if(errorObj.errorHasOccurred) return;
    providedValues.velocities = velocities;
}

export const calcTeamCapacity = (strInput) => {
    const teamCapacity = parseTeamCapacityFormInput(strInput);
    if(errorObj.errorHasOccurred) return;
    providedValues.teamCapacity = teamCapacity;
}
