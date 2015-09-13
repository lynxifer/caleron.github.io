var eventController = {};

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
        request = DB.Registration.find({depth: 1}).equal("student", DB.User.me);

    if (category) {
        if (category === "current") {

        } else if (category === "closed") {

        } else if (category === "pending") {

        }
    }

    request.resultList(function (result) {
        detailView.empty();

        result.forEach(function (registration) {

        });
    });
};

eventController.onCategoryClick = function () {
    var category = $(this).data("category");
    eventController.loadDetailView(category);

    $("#events-view").find(".selected").removeClass("selected");
    $(this).addClass("selected");
};