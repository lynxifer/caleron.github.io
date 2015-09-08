/**
 * Created by 3buchhar on 08.09.2015.
 */
var loginController = {};

loginController.init = function () {
    $("#header-user-button").css("visibility", "hidden");
};

loginController.autoLogin = function () {
    if (DB.User.me) {
        viewController.showView("dashboard");
        $("#header-user-button").css("visibility", "visible");
    }
};

loginController.login = function (event) {
    event.preventDefault();

    var username = $("#login-username-box").val();
    var password = $("#login-password-box").val();

    DB.User.login(username, password).then(function () {
        $("#header-user-button").css("visibility", "visible");
        viewController.showView("dashboard");
    }, function () {
        alert("Login fehlgeschlagen!");
    });
};

loginController.logout = function () {
    DB.User.logout().then(function () {
        viewController.showView("login");
    });
};
