var messagesController = {};

messagesController.init= function(){

};

messagesController.sendMessages = function() {
    var newMessage = new DB.Message({
        sender: DB.User.me,
        recipient: 1,
        content: ""
    });
    Message.insert().then();
    alert("Nachricht wurde verschickt");
};







