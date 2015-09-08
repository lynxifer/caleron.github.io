/**
 * Created by 3buchhar on 08.09.2015.
 */

$(document).ready(function () {
    if (DB.User.me) {
        alter("Sie sind schon eingeloggt!");
    } else {
        $("#login-button").on("click", function () {
            var username = $("#login-username-box").val();
            var password = $("#login-password-box").val();
            DB.User.login(username, password).then(function () {
                $("#login-view").hide();
                $("#dashboard-view").show();
            }, function () {
                alert("Login fehlgeschlagen!");
            });
        });
    }
});