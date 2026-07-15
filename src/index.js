// import dotenv from "dotenv";
// dotenv.config();
import "dotenv/config";
import express from 'express'
import router from './router.js';
import mongoose from 'mongoose';
import cors from "cors";

// dotenv.config();


const app = express()


app.use(express.json());
app.use(cors());

// const port = process.env.port
const PORT = process.env.PORT || 2000;
const mongodb_url = process.env.mongodb_url

// app.get("/", ((req, res) => {
//     res.send("Hello World")
// }))

app.use("/", router)

// app.listen(port, () => {
//     console.log("Server is running on port ");
// })

mongoose.connect(mongodb_url)
    .then(
        app.listen(port, () => {
            console.log("Server is running on port ");
        })
    )
    .catch((error) => {
        console.log(error)
    })


    // source /home/avyavyron/nodevenv/avyron/22/bin/activate && cd /home/avyavyron/avyron