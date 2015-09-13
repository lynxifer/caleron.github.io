var moduleRegistrationController = {};
/**
 * Trägt die ID des Modules, für das der Bestätigungsdialog angezeigt wird
 * @type {string}
 */
moduleRegistrationController.modalModule = "";
/**
 * Wird bei dem Anzeigen der Modulanmeldungs-View ausgeführt
 */
moduleRegistrationController.init = function () {
    moduleRegistrationController.loadMasterView().then(function () {
        $("#registration-view").find("div").first().click();
    });
};

/**
 * Lädt die Master-View
 * @returns {Promise}
 */
moduleRegistrationController.loadMasterView = function () {
    var mdViewSource = $("#md-view-template").html(),
        mdViewTemplate = Handlebars.compile(mdViewSource),
        registrationView = $("#registration-view"),
        masterView;

    //Master-Detail-View erzeugen und einfÃ¼gen
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
        detailView = $("#registration-view").find(".detail-view"),
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
                moduleId: module.id
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

        DB.Course.find().equal("module", "/db/Module/" + moduleId).ascending("type").resultList(function (result) {

            var practiceBox,
                examBox;

            result.forEach(function (course) {

                switch (course.type) {
                    case "lecture":
                        $('<div class="checkbox registration-course"><label><input type="checkbox" checked disabled>' +
                            "Vorlesung " + course.number + ", "
                            + framework.getWeekDayString(course.weekDay) + " von "
                            + framework.getTimeString(course.begin)
                            + " bis " + framework.getTimeString(course.end) +
                            '</label>' +
                            '</div>')
                            .data("course", course)
                            .appendTo(courseBox);

                        break;
                    case "practice":
                        if (practiceBox === undefined) {
                            practiceBox = $('<select class="form-control registration-course"></select>');
                            practiceBox.appendTo(courseBox);
                        }

                        $('<option>Übung ' + course.number + ', '
                            + framework.getWeekDayString(course.weekDay) + " von "
                            + framework.getTimeString(course.begin)
                            + " bis " + framework.getTimeString(course.end) + "</option>")
                            .data("course", course)
                            .appendTo(practiceBox);
                        break;
                    case "exam":
                        if (examBox === undefined) {
                            examBox = $('<select class="form-control registration-course"></select>');
                            examBox.appendTo(courseBox);
                        }

                        $("<option>Klausur " + course.number + ", am "
                            + framework.getDateString(course.date) + " von "
                            + framework.getTimeString(course.begin) + " bis " + framework.getTimeString(course.end) + "</option>")
                            .data("course", course)
                            .appendTo(examBox);
                        break;
                }

            });

        }).then(function () {
            moduleBox.data("loaded", true);
            moduleBox.next().slideDown();
        });
    } else {
        moduleBox.next().slideToggle();
    }
};

/**
 * Wird ausgelöst, wenn der Anmeldung-Bestätigen-Dialog angezeigt wird
 */
moduleRegistrationController.modalShow = function (event) {
    //gegeben von Bootstrap
    var button = $(event.relatedTarget),
        header = button.closest(".detail-list-item").children(0),
        moduleId = header.data("module");

    moduleRegistrationController.modalModule = undefined;
    //Akzeptieren-Button deaktivieren...
    $("#module-registration-modal-accept-btn").prop("disabled", true);

    DB.Module.load(moduleId).then(function (module) {
        moduleRegistrationController.modalModule = module;
        $("#module-registration-modal-module").html(module.name);

        //... und erst aktivieren, wenn Modul geladen ist
        $("#module-registration-modal-accept-btn").prop("disabled", false);
    });

};

/**
 * Wird ausgelöst, wenn der Akzeptieren-Button im Anmeldung-Bestätigen-Dialog geklickt wird
 * Speichert die Anmeldung in der Datenbank und zeigt dann eine Erfolgsmeldung an
 */
moduleRegistrationController.registrationAccepted = function () {
    var promises = [];
    //Elemente mit data-course-Attribut bzw. deren Select-Box auswählen
    $(".registration-course").each(function (index) {
        //this ist hier das jeweilige Element

        var course;
        if (this.tagName.toLowerCase() === "div") {
            //wenn der Tag div ist, dann ist der Kurs eine Vorlesung
            course = $(this).data("course");
        } else {
            //sonst Klausur oder Übung --> Select-Box
            course = $(this.selectedOptions[0]).data("course");
        }

        var registration = new DB.Registration({
            module: moduleRegistrationController.modalModule,
            student: DB.User.me,
            semester: null,
            course: course
        });

        //Promise in Array pushen
        promises.push(registration.save());
    });

    //Erst wenn alles gespeichert ist, Erfolgsmeldung anzeigen
    Promise.all(promises).then(function () {
        $("#module-registration-modal").modal("hide");
        alert("Anmeldung erfolgreich");
    });
};