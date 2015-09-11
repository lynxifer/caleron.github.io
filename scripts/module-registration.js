var moduleRegistrationController = {};

/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgeführt
 */
moduleRegistrationController.init = function () {
    moduleRegistrationController.loadMasterView().then(function () {
        $("#registration-manager-view").find("div").first().click();
    });
};

/**
 * Lädt die Master-View
 * @returns {Promise}
 */
moduleRegistrationController.loadMasterView = function () {
    var mdViewSource = $("#md-view-template").html(),
        mdViewTemplate = Handlebars.compile(mdViewSource),
        registrationView = $("#registration-manager-view"),
        masterView;

    //Master-Detail-View erzeugen und einfügen
    registrationView.html(mdViewTemplate());

    masterView = registrationView.find('.master-view');
    moduleRegistrationController.buildCategories(masterView);

    return moduleRegistrationController.buildFaculties(masterView);
};

/**
 * Fügt die Kategorien in die Masterview ein
 * @param {element} parent Die Masterview
 */
moduleRegistrationController.buildCategories = function (parent) {
    var categories = [
        ["Pflichtmodule", "isRequiredInMajor"],
        ["Wahlpflichtmodule", "isChoiceInMajor"],
        ["Freier Wahlbereich", "isFreeChoiceInMajor"]
    ];

    //Kategorien einfügen
    for (var i = 0; i < categories.length; i++) {
        $("<li><div>" + categories[i][0] + "</div><ul class='master-sub-list'></ul></li>")
            .data("category", categories[i][1])
            .appendTo(parent);
    }
};

/**
 * Baut die Fakultätenlisten und fügt die Click-Handler hinzu
 * @param {element} parent Die Masterview
 * @return {Promise}
 */
moduleRegistrationController.buildFaculties = function (parent) {
    var masterSubLists = parent.find(".master-sub-list");

    //Alle normalen Fakultäten zu Sublisten hinzufügen
    return DB.Faculty.find().resultList(function (result) {
        result.forEach(function (faculty) {
            $("<li>" + faculty.name + "</li>")
                .data("faculty", faculty.toString())
                .appendTo(masterSubLists);
        });
    }).then(function () {
        //Click-Handler für die Fakultäten
        masterSubLists.find("li").on("click", moduleRegistrationController.onFacultyClick);

        //Onclick-Handler für Kategorien-Boxen
        masterSubLists.prev().on("click", moduleRegistrationController.onCategoryClick);
    });
};

/**
 * Lädt die Detail-View mit der entsprechenden Ansicht
 * @param {String=} category Kategorie als Tabellenspalte
 * @param {String=} filterFaculty ID der Fakultät
 */
moduleRegistrationController.loadDetailView = function (category, filterFaculty) {

    var detailListItemSource = $("#detail-list-item-template").html(),
        detailListItemTemplate = Handlebars.compile(detailListItemSource),
        detailView = $("#registration-manager-view").find(".detail-view"),
        userMajor = DB.User.me.major,
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

    return request.resultList(function (result) {
        detailView.empty();

        result.forEach(function (module) {

            var listItemContext = {
                title: module.name,
                credits: module.credits,
                responsible: "Axel",
                precondition: "nix",
                courses: "",
                description: "Axel bringt euch alles bei",
                moduleId: module.toString()
            };

            detailView.append(detailListItemTemplate(listItemContext));
        });

    }).then(function () {
        var header = $(".detail-list-item-header");
        header.on("click", moduleRegistrationController.moduleItemClick);
        header.data("loaded", false);
    });
};

/**
 * Wird beim Klick auf eine Kategorie ausgelöst
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
    moduleRegistrationController.masterViewItemSelected($(this));
};

/**
 * Wird beim Klick auf eine Fakultät ausgelöst
 */
moduleRegistrationController.onFacultyClick = function () {
    var category = $(this).closest(".master-sub-list").parent().data("category"),
        faculty = $(this).data("faculty");

    moduleRegistrationController.loadDetailView(category, faculty);
    moduleRegistrationController.masterViewItemSelected($(this));
};

/**
 * Entfernt selected-Klasse von allen Elementen und fügt dem angegebenen Element die Klasse hinzu
 * @param {jQuery} element Das Element
 */
moduleRegistrationController.masterViewItemSelected = function (element) {
    $(".master-view").find(".selected").removeClass("selected");

    element.addClass("selected");
};

moduleRegistrationController.moduleItemClick = function () {

    var moduleBox = $(this);

    if (moduleBox.data("loaded") === false) {
        var moduleId = $(this).data("module"),
            courseBox = moduleBox.next().find(".detail-list-item-courses");

        DB.Course.find().equal("module", moduleId).resultList(function (result) {
            result.forEach(function (course) {
                var result = "";
                switch (course.type) {
                    case "lecture":
                        result = "Vorlesung " + course.number + ", "
                            + framework.getWeekDayString(course.weekDay) + " von "
                            + framework.getTimeString(course.begin)
                            + " bis " + framework.getTimeString(course.end);

                        break;
                    case "practice":
                        result = "Übung " + course.number + ", "
                            + framework.getWeekDayString(course.weekDay) + " von "
                            + framework.getTimeString(course.begin)
                            + " bis " + framework.getTimeString(course.end);
                        break;
                    case "exam":
                        result = "Klausur " + course.number + ", am "
                            + framework.getDateString(course.date) + " von "
                            + course.begin + " bis " + course.end;
                        break;
                }

                courseBox.append(result + "<br>");
            });
        }).then(function () {
            moduleBox.data("loaded", true);
            moduleBox.next().slideDown();
        });
    } else {
        moduleBox.next().slideToggle();
    }
};