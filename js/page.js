import {
    calcVelocities,
    refreshForm,
    errorObj,
    parseWorkEstimationFormInput,
    forecast,
    parseSprintDataFormInput, parseVelocitiesPart, calcWorkEstimation
} from "./calculations.js";

const setupDocument = () => {
    const stepper = new Stepper(document.querySelector('.bs-stepper'));
    const velocitiesForm = $("#velocities-form");
    const velocitiesTextarea = $('#velocities-textarea');
    const workEstimationTextarea = $("#work-estimation-textarea");
    const sprintDataForm = $("#sprint-data-form");
    const knownCapacitiesCheckbox = $("#known-capacities-checkbox");

    knownCapacitiesCheckbox.change(function (event) {
        const newTeamCapacityWrapper = $("#new-team-capacity-wrapper");
        const uncheckedLabel = $("#capacities-unchecked-label");
        const checkedLabel = $("#capacities-checked-label");
        if (event.currentTarget.checked) {
            checkedLabel.show();
            newTeamCapacityWrapper.show();
            uncheckedLabel.hide();
        } else {
            checkedLabel.hide();
            newTeamCapacityWrapper.hide();
            uncheckedLabel.show();
        }
    });

    $(".stepper-prev").click(function () {
        stepper.previous();
    });

    $("#velocities-calc").click(function () {
        const input = velocitiesTextarea.val();
        calcVelocities(input, knownCapacitiesCheckbox.is(':checked'));
        if (errorObj.errorHasOccurred) {
            alert(errorObj.errorMessage);
            return;
        }
        stepper.next();
    });

    $("#work-estimation-calc").click(function () {
        const input = workEstimationTextarea.val();
        calcWorkEstimation(input);
        if (errorObj.errorHasOccurred) {
            alert(errorObj.errorMessage);
            return;
        }
        stepper.next();
    });

    $("#forecast").click(function () {
        const {dateMin, dateMax} = forecast(sprintDataForm) || {};
        if (errorObj.errorHasOccurred) {
            alert(errorObj.errorMessage);
            return;
        }
        $('#timeline').roadmap([
            {
                //empty on purpose
            }, {
                date: `${dateMin.getDate()}.${dateMin.getMonth()}.${dateMin.getFullYear()}`,
                content: 'Won’t finish'
            }, {
                date: `${dateMax.getDate()}.${dateMax.getMonth()}.${dateMax.getFullYear()}`,
                content: 'Will finish',
            }, {
                //empty on purpose
            }
        ], {
            orientation: 'auto',
            eventsPerSlide: 4,
        });
    });

    const updateVelocitiesPart = () => {
        parseVelocitiesPart(velocitiesTextarea.val(), knownCapacitiesCheckbox.is(':checked'));
        refreshForm();
    }

    const updateWorkEstimationPart = () => {
        parseWorkEstimationFormInput(workEstimationTextarea.val());
        refreshForm();
    }

    const updateSprintDataPart = () => {
        parseSprintDataFormInput(sprintDataForm);
        refreshForm();
    }

    sprintDataForm.submit((event) => {
        event.preventDefault();
        event.stopPropagation();
    })
    velocitiesForm.focusout(updateVelocitiesPart);
    velocitiesForm.on("change paste keyup", updateVelocitiesPart);

    workEstimationTextarea.focusout(updateWorkEstimationPart);
    workEstimationTextarea.on("change paste keyup", updateWorkEstimationPart);

    sprintDataForm.submit((event) => {
        event.preventDefault();
        event.stopPropagation();
    })
    sprintDataForm.focusout(updateSprintDataPart);
    sprintDataForm.on("change paste keyup", updateSprintDataPart);
}

window.setupDocument = setupDocument;