var viewController = {};
viewController.currentView = "";
/**
 * Wird beim Klicken auf eine Kachel ausgelöst
 */
viewController.dashBoardClick = function () {
    var tileType = $(this).data("type");
    viewController.showView(tileType, $(this).html());
};

/**
 * Dient zum Wechseln der Views
 * @param {String} view Der Name der View
 * @param {String=} title Die Kachel
 */
viewController.showView = function (view, title) {
    $(".view-container").css("display", "none");

    viewController.currentView = view;

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
            newsController.init();
            break;
        case "messaging":
            $("#messaging-view").css("display", "block");
            messagesController.init();
            break;
    }

    if (title == undefined) {
        title = "Luchs";
    }
    else if (title == "@") {
        title = "Nachrichten";
    }
    document.title = title;

    $('#header-title').html(title);
};
