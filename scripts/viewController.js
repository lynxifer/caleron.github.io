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
        //Alle Views ausblenden
        $(".view-container").css("display", "none");

        //Entsprechende View wieder anzeigen
        switch (currentView) {
            case "login":
                $("#login-view").css("display", "block");
                break;
            case "dashboard":
                $("#dashboard-view").css("display", "block");
                break;
            case "registration":
                $("#registration-manager-view").css("display", "block");
                break;
        }
    }

    connectDB();
});

function connectDB() {
    DB.connect("http://luchs.baqend.com");
}