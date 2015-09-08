var moduleRegistrationController = {};

moduleRegistrationController.init = function () {
    $(".registration-module-list-item-header").on("click", function () {
        $(this).next().slideToggle();
    });
};