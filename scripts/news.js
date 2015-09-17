var newsController = {};

newsController.currentNewsCount = 0;
newsController.newsPerPage = 7;

newsController.init = function () {
    newsController.loadNewsView();
};

/**
 * Lädt News ab dem gegebenen Offset und fügt sie der View hinzu
 * @param {number=} offset
 */
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
        //View leeren
        newsView.empty();
        newsController.currentNewsCount = newsController.newsPerPage;
    }

    request.limit(newsController.newsPerPage).resultList(function (result) {
        result.forEach(function (news) {

            var listItemContext = {
                title: news.title,
                content: news.content,
                time: framework.getDateTimeString(news.time)
            };

            newsView.append(newsViewTemplate(listItemContext));
        });
    });
};

/**
 * Wird ausgelöst, wenn auf der News-View gescrollt wird
 */
newsController.scrolled = function () {
    if ($(window).height() === ($(document).height() - $(document).scrollTop())) {
        //Lädt weitere News, wenn ganz nach unten gescrollt wurde
        newsController.loadNewsView(newsController.currentNewsCount);
        newsController.currentNewsCount += newsController.newsPerPage;
    }
};