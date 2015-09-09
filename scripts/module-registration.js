var moduleRegistrationController = {};

/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgeführt
 */
moduleRegistrationController.init = function () {
    moduleRegistrationController.loadMasterView();
    moduleRegistrationController.loadDetailView();
};

moduleRegistrationController.loadMasterView = function () {
    var mdViewSource = $("#md-view-template").html(),
        mdViewTemplate = Handlebars.compile(mdViewSource),
        registrationView = $("#registration-manager-view"),
        masterView,
        masterSubLists;

    //Master-Detail-View erzeugen und einfügen
    registrationView.html(mdViewTemplate());

    masterView = registrationView.find('.master-view');

    var categories = [
        "Pflichtmodule",
        "Wahlpflichtmodule",
        "Freier Wahlbereich"
    ];

    //Kategorien einfügen
    for (var i = 0; i < categories.length; i++) {
        masterView.append("<li><div>" + categories[i] + "</div><ul class='master-sub-list'></ul></li>");
    }

    masterSubLists = registrationView.find(".master-sub-list");

    //Onclick-Handler für Kategorien-Boxen
    masterSubLists.prev().on("click", moduleRegistrationController.onCategoryClick);

    //Alle normalen Fakultäten zu Sublisten hinzufügen
    DB.Faculty.find().resultList(function (result) {
        result.forEach(function (faculty) {
            masterSubLists.append("<li>" + faculty.name + "</li>");
        });
    });
};

moduleRegistrationController.loadDetailView = function (category, filterFaculty) {

    var detailListItemSource = $("#detail-list-item-template").html(),
        detailListItemTemplate = Handlebars.compile(detailListItemSource),
        datailView = $("#registration-manager-view").find(".detail-view");

    var userMajor = DB.User.me.major,
        request;

    request = DB.Module.find();

    if (category) {
        request = request.in(category, userMajor)
    } else {
        request = request.in("isRequiredInMajor", userMajor)
    }

    if (filterFaculty) {
        request = request.in("possibleFaculties", filterFaculty);
    }

    request.resultList(function (result) {
        result.forEach(function (module) {

            var listItemContext = {
                title: module.name,
                credits: module.credits,
                responsible: "Axel",
                precondition: "nix",
                courses: "Vorlesung 1 <br> &Uuml;bung 1",
                description: "Axel bringt euch alles bei"
            };

            datailView.append(detailListItemTemplate(listItemContext));
        });

        $(".detail-list-item-header").on("click", function () {
            $(this).next().slideToggle();
        });
    });
};

moduleRegistrationController.onCategoryClick = function () {
    var masterSubList = $(this).next();

    if (masterSubList.css("display") != "block") {
        $(".master-sub-list").slideUp();
        masterSubList.slideDown();
    } else {
        masterSubList.slideUp();
    }

    //moduleRegistrationController.loadDetailView($(this).data("category"), $(this).data("faculty"));
};