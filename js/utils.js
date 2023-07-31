export function isValidDateInFuture(inputDate) {
    const inputDateObj = new Date(inputDate);
    const todayDateObj = new Date();

    inputDateObj.setHours(0, 0, 0, 0);
    todayDateObj.setHours(0, 0, 0, 0);

    return inputDateObj >= todayDateObj;
}

export function addDaysToDate(date, daysToAdd) {
    const resultDate = new Date(date);
    resultDate.setDate(resultDate.getDate() + daysToAdd);
    return resultDate;
}

export function safeParseToInt(value){
    if(isNaN(value)){
        return NaN;
    }
    return parseInt(value,10);
}