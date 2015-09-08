/**
 * Created by 3buchhar on 08.09.2015.
 */
var loginController = {};

loginController.login = function () {
    if (DB.User.me) {
        viewController.showView("dashboard");
    } else {
        $("#login-button").on("click", function () {
            var username = $("#login-username-box").val();
            var password = $("#login-password-box").val();
            DB.User.login(username, password).then(function () {
                viewController.showView("dashboard");
            }, function () {
                alert("Login fehlgeschlagen!");
            });
        });
    }
};
