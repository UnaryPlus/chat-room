const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const chats = {}

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
  socket.on("join", ({name, channel}) => {
    socket.name = name
    socket.channel = channel
    socket.join(channel)
    socket.to(channel).emit("join", name)
  })

  socket.on("send", (message) => {
    socket.emit("send", {
      name: socket.name,
      message: message,
      self: true
    })

    socket.to(socket.channel).emit("send", {
      name: socket.name,
      message: message,
      self: false
    })
  })

  socket.on("disconnect", () => {
    io.to(socket.channel).emit("disconnect", socket.name)
  })
})

server.listen(8081, () => {
  console.log("listening")
})