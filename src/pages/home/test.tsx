import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { pusherAppkey, serverUrl } from "../../utility/config";
import { tryFetch } from "../../utility/utility";

interface Chat {
  message: string;
  sender: string;
}

export default function Test() {
  const sender = "me";

  const [messageToSend, setMessageToSend] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher(pusherAppkey, {
      cluster: "eu",
    });

    const channel = pusher.subscribe("chat");

    channel.bind("chat-event", function (data: Chat) {
      setChats((prevState) => [...prevState, { sender: data.sender, message: data.message }]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await tryFetch<void>(`${serverUrl}/api/pusher`, { body: JSON.stringify({ message: messageToSend, sender }), method: "POST" });
  };

  return (
    <div>
      <p>Hello, {sender}</p>
      <div>
        {chats.map((chat) => (
          <>
            <p>{chat.message}</p>
            <small>{chat.sender}</small>
          </>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)} placeholder="start typing...." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
