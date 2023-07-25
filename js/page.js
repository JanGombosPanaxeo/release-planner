import {
    calcVelocities,
    parseVelocitiesFormInput,
    refreshForm,
    errorObj,
    parseTeamCapacityFormInput,
    calcTeamCapacity,
    calcWorkEstimation,
    parseWorkEstimationFormInput,
    forecast,
    parseSprintDataFormInput
} from "./calculations.js";

const setupDocument = () => {
    const stepper = new Stepper(document.querySelector('.bs-stepper'));
    stepper.to(4);
    const velocitiesForm = $("#velocities-form");
    const teamCapacityForm = $("#team-capacity-form");
    const workEstimationForm = $("#work-estimation-form");
    const sprintDataForm = $("#sprint-data-form");

    $(".stepper-prev").click(function () {
        stepper.previous();
    });

    $("#velocities-calc").click(function () {
        const input = velocitiesForm.val();
        calcVelocities(input);
        if (errorObj.errorHasOccurred) {
            alert(errorObj.errorMessage);
            return;
        }
        stepper.next();
    });

    $("#team-capacity-calc").click(function () {
        const input = teamCapacityForm.val();
        calcTeamCapacity(input);
        if (errorObj.errorHasOccurred) {
            alert(errorObj.errorMessage);
            return;
        }
        stepper.next();
    });

    $("#work-estimation-calc").click(function () {
        const input = workEstimationForm.val();
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
        });
    });

    const updateVelocitiesForm = () => {
        parseVelocitiesFormInput(velocitiesForm.val());
        refreshForm();
    }

    const updateTeamCapacityForm = () => {
        parseTeamCapacityFormInput(teamCapacityForm.val());
        refreshForm();
    }

    const updateWorkEstimationForm = () => {
        parseWorkEstimationFormInput(workEstimationForm.val());
        refreshForm();
    }

    const updateSprintDataForm = () => {
        parseSprintDataFormInput(sprintDataForm);
        refreshForm();
    }

    velocitiesForm.focusout(updateVelocitiesForm);
    velocitiesForm.on("change paste keyup", updateVelocitiesForm);

    teamCapacityForm.focusout(updateTeamCapacityForm);
    teamCapacityForm.on("change paste keyup", updateTeamCapacityForm);

    workEstimationForm.focusout(updateWorkEstimationForm);
    workEstimationForm.on("change paste keyup", updateWorkEstimationForm);

    sprintDataForm.submit((event) => {
        event.preventDefault();
        event.stopPropagation();
    })
    sprintDataForm.focusout(updateSprintDataForm);
    sprintDataForm.on("change paste keyup", updateSprintDataForm);
}

window.setupDocument = setupDocument;