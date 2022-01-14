exports.compose = compose;

const posts = [];

function compose(){
    const title = req.body.entryTitle;
    const entry = req.body.entryBody;

    const post = {
        title: title,
        body: entry
    }

    posts.push(post);

}