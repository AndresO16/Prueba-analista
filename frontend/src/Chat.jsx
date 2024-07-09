import React, { useEffect, useState } from 'react';
import { CardContent, Card, Icon, Container, Divider } from "semantic-ui-react";
import { FormField, Button, Form, Input } from 'semantic-ui-react';
import { MessageHeader, Message } from 'semantic-ui-react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({ socket, username, room }) => {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messagesList, setMessageList] = useState([]);

    const enviarMensaje = async () => {
        if (username && currentMessage) {
            const info = {
                message: currentMessage,
                room,
                author: username,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                fecha: new Date(Date.now()).getDate() + "/" + (new Date(Date.now()).getMonth() + 1) + "/" + new Date(Date.now()).getFullYear()
            };

            await socket.emit("enviar_mensaje", info);
            setMessageList((list) => [...list, info]);
            setCurrentMessage(""); // Resetear el campo de entrada
        }
    };

    useEffect(() => {
        const messageHandle = data => {
            setMessageList((list) => [...list, data]);
        };
        socket.on("recibir_mensaje", messageHandle);

        return () => socket.off("recibir_mensaje", messageHandle);
    }, [socket]);

    return (
        <Container>
            <Card fluid>
                <CardContent header={`Chat en vivo | Usuario ${username}`} />
                <ScrollToBottom>
                    <CardContent style={{ height: "400px", padding: "5px" }}>
                        {
                            messagesList.map((item, i) => {
                                return (
                                    <span key={i}>
                                        <Message style={{ textAlign: username === item.author ? 'right' : 'left' }}
                                            success={username === item.author}
                                            info={username !== item.author}
                                        >
                                            <MessageHeader>{item.message}</MessageHeader>
                                            <p>Enviado el {item.fecha}, a las: <i>{item.time}</i></p>
                                        </Message>
                                        <Divider />
                                    </span>
                                );
                            })
                        }
                    </CardContent>
                </ScrollToBottom>
                <CardContent extra>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            enviarMensaje();
                        }}
                    >
                        <FormField>
                            <Input
                                action={{
                                    color: "teal",
                                    labelPosition: "right",
                                    icon: "send",
                                    content: "Enviar",
                                    onClick: enviarMensaje,
                                }}
                                type="text"
                                placeholder="Mensaje"
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        enviarMensaje();
                                    }
                                }}
                            />
                        </FormField>
                    </Form>
                    <Icon name="user" />Desarrollado para SDH inc.
                </CardContent>
            </Card>
        </Container>
    );
}

export default Chat;
