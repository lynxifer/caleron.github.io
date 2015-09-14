var messagesController = {};

messagesController.init = function () {
    $("#messaging-new-message-form").hide();
    $("#outbox-view").hide();
};

messagesController.writeMessages = function(){
    $("#messaging-new-message-form").show();
    $("#outbox-view").hide();
    $("#inbox-view").hide();
};

messagesController.showOutbox = function(){
    $("#outbox-view").show();
    $("#inbox-view").hide();
    $("#messaging-new-message-form").hide();
};

messagesController.showInbox = function(){
    $("#inbox-view").show();
    $("#outbox-view").hide();
    $("#messaging-new-message-form").hide();
};

messagesController.sendMessages = function (event) {
    event.preventDefault();

    var newMessage = new DB.Message({
        sender: DB.User.me,
        recipient: $("#recipient").val(),
        title: $("#title").val(),
        content: $("#message").val(),
        time: new Date()
    });
    console.log(newMessage);

    newMessage.insert().then(function () {
        alert("Nachricht wurde verschickt");
    });
};







