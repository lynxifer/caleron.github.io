var moduleRegistrationController = {};

/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgef�hrt
 */
moduleRegistrationController.init = function () {
    moduleRegistrationController.loadMasterView();

    $("#registration-manager-view").find("div").first().click();
};

moduleRegistrationController.loadMasterView = function () {
    var mdViewSource = $("#md-view-template").html(),
        mdViewTemplate = Handlebars.compile(mdViewSource),
        registrationView = $("#registration-manager-view"),
        masterView;

    //Master-Detail-View erzeugen und einf�gen
    registrationView.html(mdViewTemplate());

    masterView = registrationView.find('.master-view');
    moduleRegistrationController.buildCategories(masterView);

    moduleRegistrationController.buildFaculties(masterView);
};

/**
 * F�gt die Kategorien in die Masterview ein
 * @param {element} parent Die Masterview
 */
moduleRegistrationController.buildCategories = function (parent) {
    var categories = [
        ["Pflichtmodule", "isRequiredInMajor"],
        ["Wahlpflichtmodule", "isChoiceInMajor"],
        ["Freier Wahlbereich", "isFreeChoiceInMajor"]
    ];

    //Kategorien einf�gen
    for (var i = 0; i < categories.length; i++) {
        $("<li><div>" + categories[i][0] + "</div><ul class='master-sub-list'></ul></li>")
            .data("category", categories[i][1])
            .appendTo(parent);
    }
};

/**
 * Baut die Fakult�tenlisten und f�gt die Click-Handler hinzu
 * @param {element} parent Die Masterview
 */
moduleRegistrationController.buildFaculties = function (parent) {
    var masterSubLists = parent.find(".master-sub-list");

    //Alle normalen Fakult�ten zu Sublisten hinzuf�gen
    DB.Faculty.find().resultList(function (result) {
        result.forEach(function (faculty) {
            $("<li>" + faculty.name + "</li>")
                .data("faculty", faculty.toString())
                .appendTo(masterSubLists);
        });

        //Click-Handler f�r die Fakult�ten
        masterSubLists.find("li").on("click", moduleRegistrationController.onFacultyClick);

        //Onclick-Handler f�r Kategorien-Boxen
        masterSubLists.prev().on("click", moduleRegistrationController.onCategoryClick);
    });
};

/**
 * L�dt die Detail-View mit der entsprechenden Ansicht
 * @param {String=} category Kategorie als Tabellenspalte
 * @param {String=} filterFaculty ID der Fakult�t
 */
moduleRegistrationController.loadDetailView = function (category, filterFaculty) {

    var detailListItemSource = $("#detail-list-item-template").html(),
        detailListItemTemplate = Handlebars.compile(detailListItemSource),
        detailView = $("#registration-manager-view").find(".detail-view"),
        userMajor = DB.User.me.major,
        request;

    detailView.empty();

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

            detailView.append(detailListItemTemplate(listItemContext));
        });

        $(".detail-list-item-header").on("click", function () {
            $(this).next().slideToggle();
        });
    });
};

/**
 * Wird beim Klick auf eine Kategorie ausgel�st
 */
moduleRegistrationController.onCategoryClick = function () {
    var masterSubList = $(this).next();

    if (masterSubList.css("display") != "block") {
        $(".master-sub-list").slideUp();
        masterSubList.slideDown();
    } else {
        masterSubList.slideUp();
    }
    //Kategorie ist am <li>-Element
    var category = $(this).parent().data("category");
    moduleRegistrationController.loadDetailView(category);
};

/**
 * Wird beim Klick auf eine Fakult�t ausgel�st
 */
moduleRegistrationController.onFacultyClick = function () {
    var category = $(this).closest(".master-sub-list").parent().data("category"),
        faculty = $(this).data("faculty");

    moduleRegistrationController.loadDetailView(category, faculty);
};