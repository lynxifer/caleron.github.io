
var viewController = {};


viewController.showView = function (view) {
    $(".view-container").css("display", "none");

    //Entsprechende View wieder anzeigen
    switch (view) {
        case "login":
            $("#login-view").css("display", "block");
            loginController.init();
            break;
        case "dashboard":
            $("#dashboard-view").css("display", "block");
            dashboardController.init();
            break;
        case "registration":
            $("#registration-manager-view").css("display", "block");
            moduleRegistrationController.init();
            break;
    }
};