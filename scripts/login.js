/**
 * Created by 3buchhar on 08.09.2015.
 */
var loginController = {};

loginController.init = function () {
    $("#header-user-button").css("visibility", "hidden");
};

loginController.autoLogin = function () {
    if (DB.User.me) {
        loginController.loginSuccess();
    }
};

loginController.login = function (event) {
    event.preventDefault();

    var username = $("#login-username-box").val();
    var password = $("#login-password-box").val();

    DB.User.login(username, password).then(function () {
        loginController.loginSuccess();
    }, function () {
        alert("Login fehlgeschlagen!");
    });
};

loginController.loginSuccess = function () {
    var username = DB.User.me.username;

    $("#header-user-button").css("visibility", "visible");
    $("#header-username-label").text(username);
    viewController.showView("dashboard");
};

loginController.logout = function () {
    DB.User.logout().then(function () {
        viewController.showView("login");
    });
};
