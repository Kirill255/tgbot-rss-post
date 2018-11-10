const Parser = require('rss-parser');
const parser = new Parser();

const fetchData = async () => {

    // let feed = await parser.parseURL('https://www.reddit.com/.rss');
    let feed = await parser.parseURL('https://habr.com/rss/all/all/');
    // console.log(feed);
    // console.log(feed.items.length);
    // console.log(feed.title);
    // console.log(feed.pubDate);
    // console.log(feed.lastBuildDate);

    const store = []; // сюда складываем статьи подходящие под наши теги

    const createArticle = (article) => {
        return ({
            title: article.title,
            link: article.guid,
            // contentSnippet: article.contentSnippet,
            // content: article.content,
            categories: article.categories,
            tags: [],
            isoDate: article.isoDate
        });
    };

    const tags = ["js", "javascript", "react", "reactjs", "redux", "next", "nextjs", "vue", "vuejs", "vuex", "nuxt", "nuxtjs", "angular", "angularjs", "rxjs", "node", "nodejs", "express", "expressjs", "mongo", "mongodb", "mongoose", "html", "html5", "css", "css3", "git", "github"];

    feed.items.forEach(item => {
        // tags.some((tag, i) => {
        //     if (item.title.toLowerCase().includes(tag) || item.contentSnippet.toLowerCase().includes(tag)) { // так ищет любое вхождение в том числе и например находит "git" в "digital", что нам не нужно, нам нужен имеено git и только
        //         let article = createArticle(item);

        //         // пробная версия ещё не тестировал, нужно дописать переписать, исключить дубли
        //         tags.forEach(tag => {
        //             if (item.title.toLowerCase().includes(tag) || item.contentSnippet.toLowerCase().includes(tag)) {
        //                 article.tags.push(`#${tag}`);
        //             }
        //         });

        //         store.push(article);
        //         return true;
        //     }
        // });


        tags.some((tag, i) => {
            let reqexp = new RegExp(`\\b${tag}\\b`, "i"); // /\b${tag}\b/i, \b - allows you to perform a "whole words only" search
            if (reqexp.test(item.title.toLowerCase()) || reqexp.test(item.contentSnippet.toLowerCase())) {
                let article = createArticle(item);

                // пробная версия ещё не тестировал, нужно дописать переписать, исключить дубли
                tags.forEach(tag => {
                    if (item.title.toLowerCase().includes(tag) || item.contentSnippet.toLowerCase().includes(tag)) {
                        article.tags.push(`#${tag}`);
                    }
                });

                store.push(article);
                return true;
            }
        });


        // console.log(item.title + ':' + item.link)
        // let title = item.title // заголовок
        // let link = item.link; // ссылка, но с параметрами "https://habr.com/post/428473/?utm_source=habrahabr&utm_medium=rss&utm_campaign=428473"
        // let link = item.guid // чистая ссылка "https://habr.com/post/428473/"
        // let content = item.content //
        // let contentSnippet = item.contentSnippet //
        // let pubDate = item.pubDate //
        // let isoDate = item.isoDate //
        // let categories = item.categories //
        // console.log('categories :', categories);

        // const article = {};
        // article.title = item.title;
        // article.link = item.guid;
        // article.contentSnippet = item.contentSnippet;
        // article.categories = item.categories;
        // article.isoDate = item.isoDate;
        // store.push(article);
    });
    console.log("store :", store);
    console.log("store.length :", store.length);

    // REDIS example
    // redis.debug_mode = true;
    // client.set("foo_rand000000000000", "some fantastic value");
    // client.del("foo_rand000000000000");
    // setTimeout(() => {
    //     client.get("foo_rand000000000000", (err, reply) => {
    //         if (err) {
    //             throw new Error(err);
    //         }
    //         if (reply) {
    //             console.log("Ответ ", reply.toString()); // Will print `some fantastic value`
    //         }

    //         redis.debug_mode = false;
    //     });
    // }, 5000);


    /* redis.debug_mode = true;
    client.set('foo', 'bar');
    client.get('foo');
    process.nextTick(function () {
        // Force closing the connection while the command did not yet return
        client.end(true);
        redis.debug_mode = false;
    }); */

    // store.forEach(article => {
    //     let tags = article.tags.join(" ");
    //     // с форматированием касяк, почему-то отступы слева у link и tags
    //     let markdown = `*${article.title}.*\n\n${article.link}\n\n${tags}`;
    //     bot.sendMessage(CHAT_ID, markdown, { parse_mode: "Markdown" })
    // });

    return store;

}

module.exports = { fetchData }