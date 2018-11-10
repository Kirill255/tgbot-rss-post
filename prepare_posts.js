const preparePosts = async (store) => {
    let posts = [];
    store.forEach((article, i) => {
        let tags = article.tags.join(" ");
        let markdown = `*${article.title}.*\n\n${article.link}\n\n${tags}`;
        let options = {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "👍",
                            callback_data: "like"
                        },
                        {
                            text: "👎",
                            callback_data: "dislike"
                        }
                    ],
                    [
                        {
                            text: "Источник",
                            url: article.link
                        }
                    ]
                ]
            }
        };
        posts.push({ markdown, options })
    });
    return posts;
}

module.exports = { preparePosts }