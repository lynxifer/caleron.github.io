var moduleRegistrationController = {};

/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgeführt
 */
moduleRegistrationController.init = function () {
    var mdViewSource = $("#md-view-template").html(),
        mdViewTemplate = Handlebars.compile(mdViewSource),
        registrationView = $("#registration-manager-view");

    //Master-Detail-View erzeugen und einfügen
    registrationView.html(mdViewTemplate());

    moduleRegistrationController.buildDetailView();
};

moduleRegistrationController.buildDetailView = function (filter) {

    var detailListItemSource = $("#detail-list-item-template").html(),
        detailListItemTemplate = Handlebars.compile(detailListItemSource),
        registrationView = $("#registration-manager-view");

    DB.Module.find().resultList(function(result)  {
        result.forEach(function (module) {

            var listItemContext = {
                title: module.name,
                credits: module.credits,
                responsible: "Axel",
                precondition: "nix",
                courses: "Vorlesung 1 <br> &Uuml;bung 1",
                description: "Axel bringt euch alles bei"
            };

            registrationView.find(".detail-view").append(detailListItemTemplate(listItemContext));
        });

        $(".detail-list-item-header").on("click", function () {
            $(this).next().slideToggle();
        });
    });


};