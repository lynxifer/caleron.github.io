/**
 * Created by 3jreimer on 09.09.2015.
 */

var calendarController = {};

/**
 * Wird beim Anzeigen des calender-view ausgeführt
 */

calendarController.init = function () {
    calendarController.loadAppointments();
};

/*TODO: +"1" noch ersetzen durch "Tag" aus Datenbank
* Fehler*/

calendarController.loadAppointments = function () {
    var calendarAppointmentViewItemSource = $("#calendar-appointment-view-template").html(),
        calendarAppointmentViewTemplate = Handlebars.compile(calendarAppointmentViewItemSource),
        calendarAppointmentView = $("#calendar-column-day1"),
        request;

    var listItemContext = {
        title: "Modul",
        /*content: news.content,*/
        time: "Zeit"
    };

    calendarAppointmentView.append(calendarAppointmentViewTemplate(listItemContext));
}
