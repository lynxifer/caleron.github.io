var newsController = {};

newsController.currentNewsCount = 0;

newsController.init = function () {
    newsController.loadNewsView();
};

newsController.loadNewsView = function (offset) {
    var newsViewSource = $("#news-view-template").html(),
        newsViewTemplate = Handlebars.compile(newsViewSource),
        newsView = $("#news-view"),
        request;


    //News-View erzeugen und einfügen
    request = DB.News.find().descending('time');

    if (offset) {
        request.offset(offset);
    } else {
        newsView.empty();
        newsController.currentNewsCount = 10;
    }

    request.limit(10).resultList(function (result) {
        result.forEach(function (news) {

            var listItemContext = {
                title: news.title,
                content: news.content,
                time: news.time.toLocaleString()
            };
            newsView.append(newsViewTemplate(listItemContext));
        });
    });
};

newsController.loadNextNews = function () {
    newsController.loadNewsView(newsController.currentNewsCount);
    newsController.currentNewsCount += 10;
};