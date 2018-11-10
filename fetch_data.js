const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD
} = require("./config");


const Parser = require('rss-parser');
const parser = new Parser();

const redis = require("redis");

const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
});

const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

client.on("error", (err) => {
    console.log("Error redis " + err);
});

// -----------------------------------------------------------------
const store = []; // сюда складываем статьи подходящие под наши теги

const createArticle = (article) => {
    return ({
        title: article.title,
        link: article.guid,
        // contentSnippet: article.contentSnippet,
        // content: article.content,
        categories: article.categories,
        tags: [],
        // isoDate: article.isoDate,
        pubDate: article.pubDate
    });
};

const tags = ["js", "javascript", "react", "reactjs", "redux", "next", "nextjs", "vue", "vuejs", "vuex", "nuxt", "nuxtjs", "angular", "angularjs", "rxjs", "node", "nodejs", "express", "expressjs", "mongo", "mongodb", "mongoose", "html", "html5", "css", "css3", "git", "github"];
// -----------------------------------------------------------------

const fetchData = async () => {

    // Только при первом запуске, чтобы установить начальную дату, дальше нужно обязательно удалить/закомментировать эту часть кода
    // try {
    //     let date = new Date(0);
    //     let res = await setAsync("oldDate", String(date))
    //     console.log('res :', res);
    // } catch (err) {
    //     throw new Error(err);
    // }

    // let feeds = await parser.parseURL('https://www.reddit.com/.rss');
    let feeds = await parser.parseURL('https://habr.com/rss/all/all/');
    // console.log(feeds);
    // console.log(feeds.items.length);
    // console.log(feeds.title);
    // console.log(feeds.pubDate);
    // console.log(feeds.lastBuildDate);


    // client.del("oldDate"); // удалит установленое значение, раскомментировать если нужно

    try {
        let oldDate = await getAsync("oldDate")
        console.log('oldDate :', oldDate);

        feeds.items.forEach(feed => {
            let d1 = new Date(oldDate);
            let d2 = new Date(feed.pubDate);

            if (d1 < d2) {

                tags.some((tag, i) => {
                    let reqexp = new RegExp(`\\b${tag}\\b`, "i"); // /\b${tag}\b/i, \b - allows you to perform a "whole words only" search
                    if (reqexp.test(feed.title.toLowerCase()) || reqexp.test(feed.contentSnippet.toLowerCase())) {
                        let article = createArticle(feed);

                        console.log('pubDate :', feed.pubDate);
                        console.log('isoDate :', feed.isoDate);
                        // пробная версия ещё не тестировал, нужно дописать переписать, исключить дубли
                        tags.forEach(tag => {
                            if (feed.title.toLowerCase().includes(tag) || feed.contentSnippet.toLowerCase().includes(tag)) {
                                article.tags.push(`#${tag}`);
                            }
                        });

                        store.push(article);
                        return true;
                    }
                });

            }

        });

    } catch (err) {
        throw new Error(err);
    }


    console.log("store :", store);
    console.log("store.length :", store.length);

    if (store.length) {
        let newDate = await setAsync("oldDate", String(store[0].pubDate))
        console.log('newDate set :', newDate);
    }

    return store;

}

module.exports = { fetchData }