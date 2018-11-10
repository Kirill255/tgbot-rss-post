const {
    PORT,
    TOKEN,
    PROXY,
    CHAT_ID,
} = require("./config");

const { fetchData } = require("./fetch_data");
const { preparePosts } = require("./prepare_posts");


// const express = require("express");
// const app = express();
// const fetch = require("node-fetch");


process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TOKEN, {
    polling: true,
    request: {
        proxy: PROXY
    },
});

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//     // res.send("GET request to the homepage");
//     res.status(200).end();
// });

// app.use((req, res, next) => {
//     res.status(404).send("Not found!");
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send("Something broke!");
// });

// app.listen(PORT, () => console.log("Server start"));


//  запускаем нашу функцию которая парсит сайт и возвращает только новые посты подходящие под наши тэги
fetchData()
    .then(store => {
        preparePosts(store) // получаем наши посты и подготовливаем для отправки через tgbot
            .then(posts => {
                console.log('posts :', posts); // получаем готовые для отправки через tgbota посты

                let delay = 5000;
                posts.forEach((post, i) => { // перебираем циклом посты и отправляем с задержкой
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
