var loginController = {};

/**
 * Wird bei dem Anzeigen des Dashboards ausgeführt
 */
loginController.init = function () {
    $("#header-user-button").css("visibility", "hidden");
};

/**
 * Prüft, ob bereits eine Login existiert zeigt bei Bedarf das Dashboard an
 */
loginController.autoLogin = function () {
    if (DB.User.me) {
        loginController.loginSuccess();
    }
};

/**
 * Wird ausgefuehrt, wenn submit beim Login-Formular ausgeloest wird
 * @param {Event} event onsubmit-Event
 */
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

/**
 * Zeigt den Logout-Button an und wechselt zum Dashboard
 */
loginController.loginSuccess = function () {
    var username = DB.User.me.username;

    $("#header-user-button").css("visibility", "visible");
    $("#header-username-label").text(username);
    viewController.showView("dashboard");
};

/**
 * Beendet die aktuelle Sitzung und zeigt den Loginscreen an
 */
loginController.logout = function () {
    DB.User.logout().then(function () {
        viewController.showView("login");
    });
};
