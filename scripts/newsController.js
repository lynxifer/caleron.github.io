var newsController = {};

newsController.init = function(){
    newsController.loadNewsView();
};

newsController.loadNewsView = function(){
    var newsViewSource = $("#news-view-template").html(),
        newsViewTemplate = Handlebars.compile(newsViewSource),
        newsView = $("#news-view"),
        request;

    newsView.empty();

    //News-View erzeugen und einf�gen
    request = DB.News.find();
    request.resultList(function (result) {
        result.forEach(function (news) {

            var listItemContext = {
                title: news.title,
                content: news.content,
                time: news.time
            };
            newsView.append(newsViewTemplate(listItemContext));
        });
    });

};