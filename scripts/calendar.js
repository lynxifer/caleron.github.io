var calendarController = {};

/**
 * Wird beim Anzeigen des calender-view ausgeführt
 */
calendarController.init = function () {
    calendarController.loadAppointments();
};

/**
 * Lädt die Anmeldungen zu Veranstaltungen aus der Datenbank und trägt sie in die View ein
 */
calendarController.loadAppointments = function () {
    var calendarAppointmentViewItemSource = $("#calendar-appointment-view-template").html(),
        calendarAppointmentViewTemplate = Handlebars.compile(calendarAppointmentViewItemSource),
        request,
        courses = [],
        promises = [];

    //Alle bisherigen Termine von der View entfernen
    $(".calendar-day-column").empty();

    request = DB.Registration.find({depth: 1}).equal("student", DB.User.me);

    request.resultList(function (result) {
        //Alle Anmeldungen mit Abhängigkeiten laden
        result.forEach(function (registration) {
            promises.push(registration.load({depth: 1}).then(function () {
                var course = registration.course;
                courses.push(course);
            }));
        });

        //Erst wenn alle geladen sind, Kalendar aufbauen
        Promise.all(promises).then(function () {
            for (var i = 0; i < courses.length; i++) {

                var type = "",
                    begin = courses[i].begin,
                    end = courses[i].end,
                    weekday = courses[i].weekDay;

                switch (courses[i].type) {
                    case "lecture":
                        type = "Vorlesung";
                        break;
                    case "practice":
                        type = "Übung";
                        break;
                }

                var listItemContext = {
                        title: courses[i].module.name,
                        type: type + " " + courses[i].number,
                        time: framework.getTimeString(courses[i].begin) + " - " + framework.getTimeString(courses[i].end)
                    },
                    dayColumn = $("#calendar-column-day" + weekday);

                $(calendarAppointmentViewTemplate(listItemContext))
                    .css("top", ((begin.getHours() + (begin.getMinutes() / 60)) - 7) * 50 + "px")
                    .css("height", ((end.getHours() + (end.getMinutes() / 60)) - (begin.getHours() + (begin.getMinutes() / 60))) * 50 + "px")
                    .appendTo(dayColumn);
            }
        });
    });


};
