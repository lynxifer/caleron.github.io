/**
 * Wird ausgeführt, wenn das Dokument geladen ist
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
    }

    DB.connect("http://luchs.baqend.com");

    DB.ready(loginController.login);
});
