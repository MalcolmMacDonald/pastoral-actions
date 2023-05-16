const winkNLP = require('wink-nlp');
const model = require('wink-eng-lite-web-model');
const nlp = winkNLP(model);
const its = nlp.its;
const BM25Vectorizer = require('wink-nlp/utilities/bm25-vectorizer');
const bm25 = BM25Vectorizer();
const fs = require("fs");
const dimred = require('dimred');


module.exports = new function (){
    const tweets = fs.readFileSync("./data/tweets.txt").toString().split("\n");
    tweets.forEach((doc) => bm25.learn(nlp.readDoc(doc).tokens().out(its.normal)));

    const allResults = tweets.map((doc) => bm25.vectorOf(nlp.readDoc(doc).tokens().out(its.normal)));
    console.log("vectors retrieved")

    allResults.forEach((result) => {
        for (var i = 0; i < result.length; i++) {
            result /= 3.0;
        }
    });

    const flatEmbeddings = dimred(allResults, {method: 'umap', dims: 2, force: true, steps: 5000, epsilon: 1});
    const linearEmbeddings = dimred(allResults, {method: 'umap', dims: 1, force: true, steps: 5000, epsilon: 1});

    console.log("embeddings calculated");



    const maxX = Math.max(...flatEmbeddings.map((embedding) => embedding[0]));
    const minX = Math.min(...flatEmbeddings.map((embedding) => embedding[0]));
    const maxY = Math.max(...flatEmbeddings.map((embedding) => embedding[1]));
    const minY = Math.min(...flatEmbeddings.map((embedding) => embedding[1]));
    const maxZ = Math.max(...linearEmbeddings);
    const minZ = Math.min(...linearEmbeddings);

    console.log("bounds calculated, normalizing")

    flatEmbeddings.forEach((embedding,i) => {
        embedding[0] = (embedding[0] - minX) / (maxX - minX);
        embedding[1] = (embedding[1] - minY) / (maxY - minY);
        embedding[2] = (linearEmbeddings[i] - minZ) / (maxZ - minZ);
    });
    console.log("normalized");

    var embeddingsArray = [];
    for(var i = 0; i < flatEmbeddings.length;
i++
)
{
    embeddingsArray.push({pos: flatEmbeddings[i], text: tweets[i]});
}
fs.writeFileSync("./data/embeddings.json", JSON.stringify(embeddingsArray, null, 2));
}