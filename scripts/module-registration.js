var moduleRegistrationController = {};

/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgef�hrt
 */
moduleRegistrationController.init = function () {
    $(".detail-list-item-header").on("click", function () {
        $(this).next().slideToggle();
    });
};