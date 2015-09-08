
var viewController = {};


viewController.showView = function (view) {
    $(".view-container").css("display", "none");

    //Entsprechende View wieder anzeigen
    switch (view) {
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
};