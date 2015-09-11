var messagesController = {};

messagesController.init= function(){

};

messagesController.sendMessages = function(event) {
    event.preventDefault();

    var newMessage = new DB.Message({
        sender: DB.User.me,
        recipient: $("#recipient").val(),
        title: $("#title").val(),
        content: $("#message").val(),
        time: new Date()
    });
    console.log(newMessage);

    newMessage.insert().then(function()
    {
        alert("Nachricht wurde verschickt");
    });


};







