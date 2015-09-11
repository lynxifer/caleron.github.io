var init = {};
/**
 * Wird ausgefuehrt, wenn das Dokument geladen ist
 */
$(document).ready(function () {
    viewController.showView("login");

    init.assignHandlers();

    DB.connect("http://luchs.baqend.com");

    init.windowResized();
});

/**
 * Setzt alle Handler
 */
init.assignHandlers = function () {
    DB.ready(loginController.dbReady);

    $(window).resize(init.windowResized);
    $(document).on("scroll", init.windowScroll);

    $("#header-logo").on("click", function () {
        if (DB.User.me) {
            viewController.showView("dashboard");
        } else {
            viewController.showView("login");
        }
    });

    $("#login-view-form").submit(loginController.login);

    $("#logout-button").on("click", loginController.logout);

    $("#dashboard-view").find("td").on("click", viewController.dashBoardClick);

    $("#messaging-new-message-form").submit(messagesController.sendMessages);

    $("#module-registration-modal").on("show.bs.modal", moduleRegistrationController.modalShown);
    $("#module-registration-modal-accept-btn").on("click", moduleRegistrationController.registrationAccepted);

};


init.windowResized = function () {
    $(".view-container").css("height", ($(window).height() - 70) + "px");
};

init.windowScroll = function () {
    if (viewController.currentView === "news") {
        if ($(window).height() === ($(document).height() - $(document).scrollTop())) {
            newsController.loadNextNews();
        }
    }
};