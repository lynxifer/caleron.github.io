var moduleRegistrationController = {};

/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgeführt
 */
moduleRegistrationController.init = function () {
    var mdViewSource = $("#md-view-template").html(),
        mdViewTemplate = Handlebars.compile(mdViewSource),
        detailListItemSource = $("#detail-list-item-template").html(),
        detailListItemTemplate = Handlebars.compile(detailListItemSource),
        registrationView = $("#registration-manager-view");

    registrationView.html(mdViewTemplate({}));

    var listItemContext = {
        title: "SE1",
        credits: 3,
        responsible: "Axel",
        precondition: "nix",
        courses: "Vorlesung 1 <br> Übung 1",
        description: "Axel bringt euch alles bei"
    };
    registrationView.find(".detail-view").html(detailListItemTemplate(listItemContext));
    registrationView.find(".detail-view").append(detailListItemTemplate(listItemContext));
    registrationView.find(".detail-view").append(detailListItemTemplate(listItemContext));

    $(".detail-list-item-header").on("click", function () {
        $(this).next().slideToggle();
    });
};