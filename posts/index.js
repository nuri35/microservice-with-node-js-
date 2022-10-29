const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/posts/create", async(req, res) => {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    posts[id] = {
        id,
        title,
    };
 // event-bus-clusterip-srv DIYEREK bu clusterıp olusturken selectorda  app: event-bus dıyor yanı ona ait bir containera poda baglanır dolaysıyla bizde o container'a istek atmıs olyuoruz  ip adresi gibi dusun dns cozumleyıcısı var  http://backend:5000 gibi dusunebılrısn.okey
    await axios.post("http://event-bus-clusterip-srv:4005/events", {
        type: "PostCreated",
        data: {
            id,
            title,
        },
    });

    res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
    console.log("received event", req.body.type);
    res.send({});
});

app.listen(4000, () => {

    console.log("Listening on 4000");
});