require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io")
const usersRoute = require('./routes/usersRoute')
const messagesRoute = require('./routes/messagesRoute')


const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth',usersRoute);
app.use("/api/messages", messagesRoute);


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB Connection Sucessful");
}).catch((err)=>{
    console.log(err.message);
})


const server =app.listen(process.env.PORT,()=>{
    console.log('Server is running on ' + process.env.PORT);
})

const io = socket(server,{
    cors:{
        origin:"https://chitchat-client-ebon.vercel.app",
        credentials: true,
    }
})

global.onlineUsers =  new Map()

io.on("connection",(socket)=>{
    global.chatSocket= socket;
    socket.on("add-user",(userID)=>{
        onlineUsers.set(userID,socket.id)
    })

    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})