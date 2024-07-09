const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        // ip donde se van a recibir las peticiones
        origin: "http://localhost:5173",
        // Solo se permiten metodos get y post
        methods: ["GET","POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`Usuario actual: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`Usuario: ${socket.id} accede a la sala: ${data}`)
    })

    socket.on("enviar_mensaje", (data) => {
        socket.to(data.room).emit("recibir_mensaje",data);
    })

    socket.on("disconnect", ()=> {
        console.log("Usuario desconectado", socket.id)
    })
})

// El servidor está corriendo
server.listen(3001,() => {
    console.log("Server Running")
})