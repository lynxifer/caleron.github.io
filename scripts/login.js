/**
 * Created by 3buchhar on 08.09.2015.
 */
var loginController = {};

loginController.autoLogin = function () {
    if (DB.User.me) {
        viewController.showView("dashboard");
    }
};

loginController.login = function (event) {
    event.preventDefault();

    var username = $("#login-username-box").val();
    var password = $("#login-password-box").val();

    DB.User.login(username, password).then(function () {
        viewController.showView("dashboard");
    }, function () {
        alert("Login fehlgeschlagen!");
    });
};

loginController.logout = function(){
        DB.User.logout().then(function(){
            viewController.showView("login");
    });
};
