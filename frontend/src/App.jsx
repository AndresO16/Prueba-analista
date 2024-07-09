import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";
import { CardContent, Card, Icon, Container, Divider } from "semantic-ui-react";
import { FormField, Button, Checkbox, Form } from 'semantic-ui-react';

const socket = io.connect("http://localhost:3001");

function App() {
  // Nombre de usuario para ingrear al chat
  const [username, setUsername] = useState("");
  // Chat
  const [room, setRoom] = useState("");
  const [mostrarChat, setMostrarChat] = useState(false);

  const joinRoom = () => {
    if (username != "" && room != "") {
      socket.emit("join_room", room);
      setMostrarChat(true);
    }
  };

  return (
    <Container>
      { !mostrarChat? (
        <Card fluid>
        <CardContent header="Unirme al chat" />
        <CardContent>
          <Form>
            <FormField>
              <label>Nombre de usuario:</label>
              <input
                type="text"
                placeholder="Usuario"
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormField>
            <FormField>
              <label>Número de sala:</label>
              <input
                type="text"
                placeholder="ID Sala:"
                onChange={(e) => setRoom(e.target.value)}
              />
            </FormField>

            <Button onClick={joinRoom}>Unirme</Button>
          </Form>
        </CardContent>
        <CardContent extra>
          <Icon name="user" />4 Friends
        </CardContent>
        </Card>
        )  : (
        <Chat socket={socket} username={username} room={room}></Chat>
      )}
    </Container>
  );
}

export default App;
