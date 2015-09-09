var moduleRegistrationController = {};

/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgeführt
 */
moduleRegistrationController.init = function () {
    $(".detail-list-item-header").on("click", function () {
        $(this).next().slideToggle();
    });
};