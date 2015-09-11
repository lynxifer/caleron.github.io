var messagesController = {};

messagesController.init= function(){

};

messagesController.sendMessages = function() {
    var newMessage = new DB.Message({
        sender: DB.User.me,
        recipient: $("#recipient-message").val(),
        title: $("#title-message").val(),
        content: $("#content-message").val(),
        time: $("#send-message-button").val($date)
    });
    Message.insert().then();
    alert("Nachricht wurde verschickt");
};







