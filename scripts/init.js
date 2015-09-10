var init = {};
/**
 * Wird ausgefï¿½hrt, wenn das Dokument geladen ist
 */
$(document).ready(function () {
    /**
     * Variable aus dem LocalStorage
     * Setzen mit localStorage.setItem("currentView", "login");
     */
    var currentView = localStorage.getItem("currentView");

    //nur Ausführen, wenn Variable im localStorage vorhanden
    if (currentView) {
        viewController.showView(currentView);
    } else {
        viewController.showView("login");
    }

    DB.connect("http://luchs.baqend.com");

    init.assignHandlers();
});

init.assignHandlers = function () {
    DB.ready(loginController.autoLogin);

    $("#login-view-form").submit(loginController.login);

    $("#logout-button").on("click", loginController.logout);
};