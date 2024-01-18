const express = require('express')
const app = express()
const {Queue} = require('bullmq')
const IORedis = require('ioredis');

const {SendMessageFromQueue} = require('./Worker')

const connectRedis = new IORedis({
    host: '',
    port: "",
    password:'',
    username:''
}).on('connect', () => {
    console.log("Redis Connected");
})

const notification = new Queue('email-queue',{connection:connectRedis}).on('error', (error) => {
     throw new Error("Connection Error Occurred")
});

// hear we have give queue name
/*
const notification = new Queue('email-queue',{
    connection:{
        host: 'redis-26a7bab1-parthiv-e99f.a.aivencloud.com',
        port: 10758,
        password:'AVNS_g7etIxSFYljuLuIqZ3Z',
    username:'default'
   } 
}).on('error', (error) => {
    throw new Error("Connection Error Occurred")
});
*/

async function init() {
    app.use(express.json())

    app.post('/send-mail', async (req,res) => {
        // console.log(req.body);
        const result = await notification.add('email to parthiv', req.body,{ removeOnComplete: true})
        if (result) {
            return res.json({message: `email send`});
        }
        else{
            return res.json({message: 'email not send'})
        }
    })
    
    // worker get message and send 
    SendMessageFromQueue()

    app.listen(3000, (err) => {
        if (!err) {
            console.log("server started at 3000");
        }
    })
}

init()