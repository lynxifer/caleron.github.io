var eventController = {};
eventController.currentlyShownModules = {};
eventController.modalModule = {};
eventController.modalModuleBox = undefined;


eventController.init = function () {
    eventController.loadMasterView();
};

eventController.loadMasterView = function () {
    var mdViewSource = $("#md-view-template").html(),
        mdViewTemplate = Handlebars.compile(mdViewSource),
        eventView = $("#events-view"),
        masterView;

    //Master-Detail-View erzeugen und einfügen
    eventView.html(mdViewTemplate());

    masterView = eventView.find('.master-view');

    var categories = [
        ["Aktuell belegte Module", "current"],
        ["Abgeschlossene Module", "closed"],
        ["Schwebende Anmeldungen", "pending"]
    ];

    //Kategorien einfügen
    for (var i = 0; i < categories.length; i++) {
        $("<li><div>" + categories[i][0] + "</div></li>")
            .data("category", categories[i][1])
            .appendTo(masterView);
    }

    var categoryItems = eventView.find(".master-view").find("li");
    categoryItems.on("click", eventController.onCategoryClick);

    //Klick auslösen, um Detailview zu laden
    categoryItems.first().click();
};

eventController.loadDetailView = function (category) {
    console.log(category);

    var detailView = $("#events-view").find(".detail-view"),
        request = DB.Registration.find().equal("student", DB.User.me),
        modules = {};

    //request = DB.Registration.find({depth: 1}).equal("student", DB.User.me), geht nicht
    // --> depth: 1 hat nur Wirkung, wenn die Objekte der Abhängigkeiten bereits in einem Lokalcache sind

    if (category) {
        request = request.equal("status", category);
    }

    var promises = [];
    request.resultList(function (result) {
        detailView.empty();

        result.forEach(function (registration) {
            promises.push(registration.load({depth: 1}).then(function () {

                var module = registration.module;

                if (modules[module.shortname] === undefined) {
                    modules[module.shortname] = registration.module;
                }
                if (modules[module.shortname].courses === undefined) {
                    modules[module.shortname].courses = [];
                }

                var found = false;
                for (var i = 0; i < modules[module.shortname].courses.length; i++) {
                    if (modules[module.shortname].courses[i].id === registration.course.id) {
                        found = true;
                    }
                }
                //Nur hinzufügen, wenn noch nicht im Array
                if (!found) {
                    var course = registration.course;
                    course.registration = registration;
                    modules[module.shortname].courses.push(course);
                }
            }));

        });

        Promise.all(promises).then(function () {
            eventController.currentlyShownModules = modules;

            var detailListItemSource = $("#detail-list-item-template").html(),
                detailListItemTemplate = Handlebars.compile(detailListItemSource);

            for (var moduleShort in modules) {

                var courseContent = "",
                    examResult;

                for (var i = 0; i < modules[moduleShort].courses.length; i++) {
                    var course = modules[moduleShort].courses[i];

                    switch (course.type) {
                        case "lecture":
                            courseContent += '<div>' +
                                "Vorlesung " + course.number + ", "
                                + framework.getWeekDayString(course.weekDay) + " von "
                                + framework.getTimeString(course.begin)
                                + " bis " + framework.getTimeString(course.end) +
                                '</div>';

                            break;
                        case "practice":

                            courseContent += '<div>Übung ' + course.number + ', '
                                + framework.getWeekDayString(course.weekDay) + " von "
                                + framework.getTimeString(course.begin)
                                + " bis " + framework.getTimeString(course.end) + "</div>";

                            break;
                        case "exam":

                            courseContent += "<div>Klausur " + course.number + ", am "
                                + framework.getDateString(course.date) + " von "
                                + framework.getTimeString(course.begin) + " bis " + framework.getTimeString(course.end) + "</div>";

                            if (category === "closed") {
                                examResult = "Abgeschlossen mit Note " + course.registration.result + " - ";
                            }
                            break;
                    }
                }

                var context = {
                    title: modules[moduleShort].name,
                    credits: modules[moduleShort].credits,
                    responsible: "Axel",
                    precondition: "nix",
                    courses: courseContent,
                    description: "Axel bringt euch alles bei",
                    moduleId: moduleShort
                };

                if (category === "closed") {
                    context.result = examResult;
                }

                detailView.append(detailListItemTemplate(context));
            }
        }).then(function () {
            var header = detailView.find(".detail-list-item-header");

            header.on("click", eventController.moduleItemClick);

            detailView.find(".detail-list-item-register-btn").hide();
            detailView.find(".detail-list-item-unregister-btn").show();
        });
    });

};

eventController.moduleItemClick = function () {
    var moduleBox = $(this);
    moduleBox.next().slideToggle();
};

eventController.onCategoryClick = function () {
    var category = $(this).data("category");
    eventController.loadDetailView(category);

    $("#events-view").find(".selected").removeClass("selected");
    $(this).addClass("selected");
};

eventController.modalShow = function (event) {
    //gegeben von Bootstrap
    var button = $(event.relatedTarget),
        header = button.closest(".detail-list-item").children(0),
        moduleShort = header.data("module"),
        module = eventController.currentlyShownModules[moduleShort];

    eventController.modalModule = module;
    eventController.modalModuleBox = button.closest(".detail-list-item");

    $("#module-unregistration-modal-module").html(module.name);
};

eventController.unregistrationAccepted = function () {
    var promises = [],
        module = eventController.modalModule;

    for (var i = 0; i < module.courses.length; i++) {
        promises.push(module.courses[i].registration.delete());
    }

    Promise.all(promises).then(function () {
        $("#module-unregistration-modal").modal("hide");
        alert("Abmeldung erfolgreich");

        eventController.modalModuleBox.remove();
    });
};