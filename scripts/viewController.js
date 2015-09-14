var viewController = {};
viewController.currentView = "";

viewController.init = function () {
    viewController.views = {
        login: loginController,
        dashboard: dashboardController,
        registration: moduleRegistrationController,
        calendar: calendarController,
        news: newsController,
        messaging: messagesController,
        events: eventController
    };
};

/**
 * Wird beim Klicken auf eine Kachel ausgel�st
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

    $("#" + view + "-view").css("display", "block");
    //Controller der View initialisieren, wenn vorhanden
    if (viewController.views[view]) {
        viewController.views[view].init();
    }

    if (title == undefined) {
        title = "Luchs";
        document.title = title;
    } else if (title == "@") {
        title = "Nachrichten";
        document.title = "Luchs - " + title;
    } else {
        document.title = "Luchs - " + title;
    }

    $('#header-title').html(title);
};
