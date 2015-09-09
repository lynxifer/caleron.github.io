var moduleRegistrationController = {};

/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgeführt
 */
moduleRegistrationController.init = function () {
    $(".registration-module-list-item-header").on("click", function () {
        $(this).next().slideToggle();
    });
};