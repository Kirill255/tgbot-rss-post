const {
    PORT,
    TOKEN,
    PROXY,
    CHAT_ID,
    CHAT_USERNAME,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD
} = require("./config");

const { fetchData } = require("./fetch_data");
const { preparePosts } = require("./prepare_posts");


const express = require("express");
const app = express();
const fetch = require("node-fetch");
// let Parser = require('rss-parser');
// let parser = new Parser();

const redis = require("redis");
const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
});

client.on("error", (err) => {
    console.log("Error redis " + err);
});

process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, {
    polling: true,
    request: {
        proxy: PROXY
    },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // res.send("GET request to the homepage");
    res.status(200).end();
});

app.use((req, res, next) => {
    res.status(404).send("Not found!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(PORT, () => console.log("Server start"));


// (async () => {
// const myFunc = async () => {

//     // let feed = await parser.parseURL('https://www.reddit.com/.rss');
//     let feed = await parser.parseURL('https://habr.com/rss/all/all/');
//     // console.log(feed);
//     // console.log(feed.items.length);
//     // console.log(feed.title);
//     // console.log(feed.pubDate);
//     // console.log(feed.lastBuildDate);

//     const store = []; // сюда складываем статьи подходящие под наши теги

//     const createArticle = (article) => {
//         return ({
//             title: article.title,
//             link: article.guid,
//             // contentSnippet: article.contentSnippet,
//             // content: article.content,
//             categories: article.categories,
//             tags: [],
//             isoDate: article.isoDate
//         });
//     };

//     const tags = ["js", "javascript", "react", "reactjs", "redux", "next", "nextjs", "vue", "vuejs", "vuex", "nuxt", "nuxtjs", "angular", "angularjs", "rxjs", "node", "nodejs", "express", "expressjs", "mongo", "mongodb", "mongoose", "html", "html5", "css", "css3", "git", "github"];

//     feed.items.forEach(item => {
//         // tags.some((tag, i) => {
//         //     if (item.title.toLowerCase().includes(tag) || item.contentSnippet.toLowerCase().includes(tag)) { // так ищет любое вхождение в том числе и например находит "git" в "digital", что нам не нужно, нам нужен имеено git и только
//         //         let article = createArticle(item);

//         //         // пробная версия ещё не тестировал, нужно дописать переписать, исключить дубли
//         //         tags.forEach(tag => {
//         //             if (item.title.toLowerCase().includes(tag) || item.contentSnippet.toLowerCase().includes(tag)) {
//         //                 article.tags.push(`#${tag}`);
//         //             }
//         //         });

//         //         store.push(article);
//         //         return true;
//         //     }
//         // });


//         tags.some((tag, i) => {
//             let reqexp = new RegExp(`\\b${tag}\\b`, "i"); // /\b${tag}\b/i, \b - allows you to perform a "whole words only" search
//             if (reqexp.test(item.title.toLowerCase()) || reqexp.test(item.contentSnippet.toLowerCase())) {
//                 let article = createArticle(item);

//                 // пробная версия ещё не тестировал, нужно дописать переписать, исключить дубли
//                 tags.forEach(tag => {
//                     if (item.title.toLowerCase().includes(tag) || item.contentSnippet.toLowerCase().includes(tag)) {
//                         article.tags.push(`#${tag}`);
//                     }
//                 });

//                 store.push(article);
//                 return true;
//             }
//         });


//         // console.log(item.title + ':' + item.link)
//         // let title = item.title // заголовок
//         // let link = item.link; // ссылка, но с параметрами "https://habr.com/post/428473/?utm_source=habrahabr&utm_medium=rss&utm_campaign=428473"
//         // let link = item.guid // чистая ссылка "https://habr.com/post/428473/"
//         // let content = item.content //
//         // let contentSnippet = item.contentSnippet //
//         // let pubDate = item.pubDate //
//         // let isoDate = item.isoDate //
//         // let categories = item.categories //
//         // console.log('categories :', categories);

//         // const article = {};
//         // article.title = item.title;
//         // article.link = item.guid;
//         // article.contentSnippet = item.contentSnippet;
//         // article.categories = item.categories;
//         // article.isoDate = item.isoDate;
//         // store.push(article);
//     });
//     console.log("store :", store);
//     console.log("store.length :", store.length);

//     // REDIS example
//     // redis.debug_mode = true;
//     // client.set("foo_rand000000000000", "some fantastic value");
//     // client.del("foo_rand000000000000");
//     // setTimeout(() => {
//     //     client.get("foo_rand000000000000", (err, reply) => {
//     //         if (err) {
//     //             throw new Error(err);
//     //         }
//     //         if (reply) {
//     //             console.log("Ответ ", reply.toString()); // Will print `some fantastic value`
//     //         }

//     //         redis.debug_mode = false;
//     //     });
//     // }, 5000);


//     /* redis.debug_mode = true;
//     client.set('foo', 'bar');
//     client.get('foo');
//     process.nextTick(function () {
//         // Force closing the connection while the command did not yet return
//         client.end(true);
//         redis.debug_mode = false;
//     }); */

//     // store.forEach(article => {
//     //     let tags = article.tags.join(" ");
//     //     // с форматированием касяк, почему-то отступы слева у link и tags
//     //     let markdown = `*${article.title}.*\n\n${article.link}\n\n${tags}`;
//     //     bot.sendMessage(CHAT_ID, markdown, { parse_mode: "Markdown" })
//     // });


//     let delay = 5000;
//     store.forEach((article, i) => {
//         setTimeout(() => {
//             let tags = article.tags.join(" ");
//             let markdown = `*${article.title}.*\n\n${article.link}\n\n${tags}`;
//             bot.sendMessage(CHAT_ID, markdown, {
//                 parse_mode: "Markdown",
//                 reply_markup: {
//                     inline_keyboard: [
//                         [
//                             {
//                                 text: "👍",
//                                 callback_data: "like"
//                             },
//                             {
//                                 text: "👎",
//                                 callback_data: "dislike"
//                             }
//                         ],
//                         [
//                             {
//                                 text: "Источник",
//                                 url: article.link
//                             }
//                         ]
//                     ]
//                 }
//             })//.then(res => console.log('res :', res));
//         }, delay * i);
//     });

//     // })();
// }


// setTimeout(() => {
//     myFunc();
// }, 15000);

fetchData()
    .then(store => {
        preparePosts(store)
            .then(posts => {
                // console.log('posts :', posts);
                let delay = 5000;
                posts.forEach((post, i) => {
                    setTimeout(() => {
                        bot.sendMessage(CHAT_ID, post.markdown, post.options)
                    }, delay * i);
                });

            });
    });

bot.on("message", msg => {
    console.log('1');
    console.log('msg :', msg);
})

bot.on("channel_post", msg => {
    console.log('2');
    console.log('msg :', msg);
})

bot.on("edited_channel_post", msg => {
    console.log('3');
    console.log('msg :', msg);
})

bot.on("callback_query", query => {
    console.log('query :', query);

    let { id, data } = query;
    if (data === "like") {
        bot.answerCallbackQuery(id, { text: "Нравится", cache_time: 0 })
    }

    if (data === "dislike") {
        bot.answerCallbackQuery(id, { text: "Hе нравится", cache_time: 0 })
    }
})

// error handling
bot.on("polling_error", (error) => {
    console.log("=== polling_error ===");
    console.log(error);
});


process.on("uncaughtException", (error) => {
    let time = new Date();
    console.log("=== uncaughtException ===");
    console.log("TIME:", time);
    console.log("NODE_CODE:", error.code);
    console.log("MSG:", error.message);
    console.log("STACK:", error.stack);
});

process.on("unhandledRejection", (error) => {
    let time = new Date();
    console.log("=== unhandledRejection ===");
    console.log("TIME:", time);
    console.log("NODE_CODE:", error.code);
    console.log("MSG:", error.message);
    console.log("STACK:", error.stack);
});
