var viewController = {};

/**
 * Dient zum Wechseln der Views
 * @param {String} view Der Name der View
 */
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
        case "calendar":
            $("#calendar-view").css("display", "block");
            calendarController.init();
            break;
        case "news":
            $("#news-view").css("display", "block");
            break;
    }
};

viewController.dashBoardClick = function () {
    var tileType = $(this).data("type");
    viewController.showView(tileType);
};