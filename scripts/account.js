var accountController = {};

accountController.init = function () {
    accountController.loadInformationView();
};

accountController.loadInformationView = function () {
    var accountSource = $("#account-template").html(),
        accountTemplate = Handlebars.compile(accountSource),
        accountView = $("#account-view"),
        request;

    DB.User.me.load({depth: 1}).then(function (result) {
        var accountContext = {
            name: result.username,
            studentId: result.studentId,
            address: result.address,
            email: result.email,
            major: result.major.name
        };

        accountView.html(accountTemplate(accountContext));

    });

};

