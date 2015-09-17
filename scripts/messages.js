var messagesController = {};

/**
 * Wird beim Anzeigen der View aufgerufen
 */
messagesController.init = function () {
    //Klick auf Posteingang auslösen
    $("#messaging-menu").children()[0].click();
};

/**
 * Wird beim Klick auf einen Menu-Item ausgelöst
 */
messagesController.optionClick = function () {
    //Typ, etwa inbox
    var type = $(this).data("type");

    //Nur das angeklickte Menu-Item active machen
    $("#messaging-menu").find(".selected").removeClass("selected");
    $(this).addClass("selected");

    //Alle Sub-Views verstecken und nur eine Anzeigen
    $(".messaging-sub-view").hide();
    switch (type) {
        case "inbox":
            $("#messaging-inbox-view").show();
            break;
        case "outbox":
            $("#messaging-outbox-view").show();
            break;
        case "write":
            $("#messaging-new-message-form").show();
            break;
    }

    //Nachrichten laden, wenn nötig
    if (type != "write") {
        messagesController.loadMessageView(type)
    }
};

/**
 * Lädt Nachrichten in die Sub-View
 * @param {String} type inbox oder outbox
 * @returns {*|Promise.<Array.<baqend.binding.Entity>>}
 */
messagesController.loadMessageView = function (type) {
    var loadMessageSource = $("#message-template").html(),
        loadMessageTemplate = Handlebars.compile(loadMessageSource),
        parentView = $("#outbox-view"),
        request,
        promises = [];

    //request erstellen
    request = DB.Message.find().descending("time");

    //type unterscheiden
    if (type === "inbox") {
        parentView = $("#messaging-inbox-view");
        request = request.equal("recipient", DB.User.me.messageUser);
    } else {
        parentView = $("#messaging-outbox-view");
        request = request.equal("sender", DB.User.me.messageUser);
    }
    //entsprechende Sub-View leeren
    parentView.empty();

    return request.resultList(function (result) {
        result.forEach(function (msg) {
            //Alle Nachrichten nachladen, damit auch MessageUser geladen sind
            promises.push(msg.load({depth: 1}).then(function (message) {

                var messageItemContext = {
                    title: message.title,
                    content: message.content,
                    time: framework.getDateTimeString(message.time)
                };

                if (type === "inbox") {
                    messageItemContext.sender = "Absender: " + message.sender.name;
                } else {
                    messageItemContext.recipient = "Empfänger: " + message.recipient.name;
                }
                //In Sub-View einfügen
                parentView.append(loadMessageTemplate(messageItemContext));
            }));
        });

        //Erst wenn alle Nachrichten geladen sind...
        Promise.all(promises).then(function () {
            //...Click-Handler hinzufügen
            parentView.find("h1").on("click", messagesController.messageClick);
        });

    });
};

/**
 * Wird beim Klick auf einen Nachrichtentitel ausgelöst und klappt den Inhalt aus
 */
messagesController.messageClick = function () {
    $(this).next().slideToggle();

    var activeItems = $(".messaging-sub-view").find(".selected");
    activeItems.find("div").slideUp();
    if (!$(this).parent().hasClass("selected")) {
        activeItems.removeClass("selected");
    }

    $(this).parent().toggleClass("selected");
};


/**
 * Wird zum Absenden einer Nachricht ausgeführt
 * @param {Event} event
 */
messagesController.sendMessage = function (event) {
    event.preventDefault();

    DB.MessageUser.find().equal("name", $("#messaging-new-message-recipient").val()).singleResult().then(function (recipient) {

        if (recipient == null) {
            alert("Empfänger nicht gefunden!");
            return;
        }

        var newMessage = new DB.Message({
            sender: DB.User.me.messageUser,
            recipient: recipient,
            title: $("#messaging-new-message-title").val(),
            content: $("#messaging-new-message-content").val(),
            time: new Date()
        });
        //Formular zurücksetzen, damit nicht doppelt verschickt werden kann
        $("#messaging-new-message-form")[0].reset();

        //Nachricht abspeichern
        newMessage.insert().then(function () {
            alert("Nachricht wurde verschickt");
        });
    });
};


