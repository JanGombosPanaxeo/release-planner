import {
    calcVelocities,
    refreshForm,
    errorObj,
    parseWorkEstimationPart,
    forecast,
    parseSprintDataPart, parseVelocitiesPart, calcWorkEstimation, resetErrorObj, resetProvidedValues
} from "./calculations.js";
import {safeParseToInt} from "./utils.js";

const setupDocument = () => {
    const stepper = new Stepper(document.querySelector('.bs-stepper'));
    const velocitiesForm = $("#velocities-form");
    const velocitiesTextarea = $('#velocities-textarea');
    const workEstimationTextarea = $("#work-estimation-textarea");
    const sprintDataForm = $("#sprint-data-form");
    const knownCapacitiesCheckbox = $("#known-capacities-checkbox");
    const resetTimelineButton = $("#reset-timeline");
    const timeline = $('#timeline');
    const newTeamCapacityInput = $("#new-team-capacity-input");

    resetTimelineButton.click((_) => {
        velocitiesForm.trigger('reset');
        workEstimationTextarea.val('');
        sprintDataForm.trigger('reset');
        knownCapacitiesCheckbox.trigger('change');
        resetProvidedValues();
        resetErrorObj();
        refreshForm();
        stepper.to(0);
        timeline.hide();
        resetTimelineButton.hide();
    })

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
        resetErrorObj();
        refreshForm();
        stepper.previous();
    });

    $("#velocities-calc").click(function () {
        const input = velocitiesTextarea.val();
        const newTeamCapacityValue = knownCapacitiesCheckbox.is(':checked') ? newTeamCapacityInput.val() : null;
        calcVelocities(input, knownCapacitiesCheckbox.is(':checked'), newTeamCapacityValue);
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
        const plannedStoryPoints = safeParseToInt(sprintDataForm.find('#plannedStoryPoints').val());
        const sprintLength = safeParseToInt(sprintDataForm.find('#sprintLength').val());
        const sprintStart = sprintDataForm.find('#sprintStart').val();
        const {dateMin, dateMax} = forecast(plannedStoryPoints, sprintLength, sprintStart) || {};
        if (errorObj.errorHasOccurred) {
            alert(errorObj.errorMessage);
            return;
        }
        const dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
        timeline.roadmap([
            {
                //empty on purpose
            }, {
                date: `${dateFormatter.format(dateMin)}`,
                content: 'Won’t finish'
            }, {
                date: 'Dates in between',
                content: 'Might finish',
            }, {
                date: `${dateFormatter.format(dateMax)}`,
                content: 'Will finish',
            }, {
                //empty on purpose
            }
        ], {
            orientation: 'auto',
            eventsPerSlide: 5,
        });
        timeline.show();
        resetTimelineButton.show();
    });

    const updateVelocitiesPart = () => {
        const newTeamCapacityValue = knownCapacitiesCheckbox.is(':checked') ? newTeamCapacityInput.val() : null;
        parseVelocitiesPart(velocitiesTextarea.val(), knownCapacitiesCheckbox.is(':checked'), newTeamCapacityValue);
        refreshForm();
    }

    const updateWorkEstimationPart = () => {
        parseWorkEstimationPart(workEstimationTextarea.val());
        refreshForm();
    }

    const updateSprintDataPart = () => {
        const plannedStoryPoints = safeParseToInt(sprintDataForm.find('#plannedStoryPoints').val());
        const sprintLength = safeParseToInt(sprintDataForm.find('#sprintLength').val());
        const sprintStart = sprintDataForm.find('#sprintStart').val();
        parseSprintDataPart(plannedStoryPoints, sprintLength, sprintStart);
        refreshForm();
    }

    velocitiesForm.submit((event) => {
        event.preventDefault();
        event.stopPropagation();
    })
    velocitiesForm.on("change paste keyup", updateVelocitiesPart);

    workEstimationTextarea.on("change paste keyup", updateWorkEstimationPart);

    sprintDataForm.submit((event) => {
        event.preventDefault();
        event.stopPropagation();
    })
    sprintDataForm.on("change paste keyup", updateSprintDataPart);
}

window.setupDocument = setupDocument;