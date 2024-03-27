import { io } from "socket.io-client";

export const initSocket = async () => {
  return io("https://smart-ide.up.railway.app", {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  });
};
