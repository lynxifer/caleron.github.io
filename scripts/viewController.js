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
            viewController.changeTitles('Luchs');
            break;
        case "dashboard":
            $("#dashboard-view").css("display", "block");
            dashboardController.init();
            viewController.changeTitles('Luchs');
            break;
        case "registration":
            $("#registration-manager-view").css("display", "block");
            moduleRegistrationController.init();
            viewController.changeTitles(document.getElementById('tile-registration').innerHTML);
            break;
        case "calendar":
            $("#calendar-view").css("display", "block");
            calendarController.init();
            viewController.changeTitles(document.getElementById('tile-calendar').innerHTML);
            break;
        case "news":
            $("#news-view").css("display", "block");
            newsController.init();
            viewController.changeTitles(document.getElementById('tile-news').innerHTML);
            break;
        case "messaging":
            $("#messaging-view").css("display", "block");
            messagesController.init();
            viewController.changeTitles(document.getElementById('tile-messaging').innerHTML);
            break;

    }
};

viewController.dashBoardClick = function () {
    var tileType = $(this).data("type");
    viewController.showView(tileType);
};

viewController.changeTitles = function (inhalt) {
    document.getElementById('general-title').innerHTML = inhalt;
    document.getElementById('header-title').innerHTML = inhalt;
}