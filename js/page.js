import {
    calcVelocities,
    parseVelocitiesFormInput,
    refreshForm,
    errorObj,
    parseTeamCapacityFormInput, calcTeamCapacity
} from "./calculations.js";

const setupDocument = () => {
    const stepper = new Stepper(document.querySelector('.bs-stepper'));
    const velocitiesForm = $("#velocities-form");
    const teamCapacityForm = $("#team-capacity-form");
    // $(".stepper-next").click(function(){
    //     stepper.next();
    // });

    $(".stepper-prev").click(function () {
        stepper.previous();
    });

    $("#velocities-calc").click(function () {
        const input = $("#velocities-form").val();
        calcVelocities(input);
        if(errorObj.errorHasOccurred){
            alert(errorObj.errorMessage);
            return;
        }
        stepper.next();
    });

    $("#forecast").click(function () {
        const input = $("#team-capacity-form").val();
        calcTeamCapacity(input);
        if(errorObj.errorHasOccurred){
            alert(errorObj.errorMessage);
            return;
        }
    });

    const updateVelocitiesForm = () => {
        parseVelocitiesFormInput(velocitiesForm.val());
        refreshForm();
    }

    const updateTeamCapacityForm = () => {
        parseTeamCapacityFormInput(teamCapacityForm.val());
        refreshForm();
    }

    velocitiesForm.focusout(updateVelocitiesForm);
    velocitiesForm.on("change paste keyup", updateVelocitiesForm );

    teamCapacityForm.focusout(updateTeamCapacityForm);
    teamCapacityForm.on("change paste keyup", updateTeamCapacityForm);
}

window.setupDocument = setupDocument;