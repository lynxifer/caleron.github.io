var init = {};
/**
 * Wird ausgefuehrt, wenn das Dokument geladen ist
 */
$(document).ready(function () {
    viewController.showView("login");

    init.assignHandlers();

    DB.connect("http://luchs.baqend.com");

});

/**
 * Setzt alle Handler
 */
init.assignHandlers = function () {
    DB.ready(loginController.autoLogin);

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
};