import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editors from "./Editor";
import { initSocket } from "../socket";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [html, setHtml] = useState("");

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast("Socket connection failed, try again later.", {
          icon: "❌",
        });
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: location.state?.roomId,
        photo: location.state?.photo,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast(`${username} joined the room.`, {
              icon: "🤝",
            });
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast(`${username} left the room.`, {
          icon: "☹",
        });
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(location.state?.roomId);
      toast("Room ID has been copied to your Clipboard !", {
        icon: "📋",
      });
    } catch (err) {
      toast("Could not copy the Room ID", {
        icon: "❌",
      });
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  return (
    <main>
      <Tilt
        className="tilt"
        perspective={5500}
        glareEnable={true}
        glareMaxOpacity={0.45}
        tiltEnable={false}
        glarePosition="all"
        glareColor="#ffffff"
        glareBorderRadius="2.5dvmin"
      >
        <div className="inner-element">
          <button className="vin" style={{
            display: "none"
          }}>
            🎙
          </button>
          <div className="aside">
            <section>
              <img src="/android-chrome-512x512.png" alt="logo" />
            </section>
            <div className="group">
              <section>
                <button id="leave" onClick={leaveRoom}>
                  ⇦
                </button>
                <h3>Members</h3>
                <button id="copy" onClick={copyRoomId}>
                  ⏍
                </button>
              </section>
              <div className="clients">
                {clients.map((client) => (
                  <Client
                    key={client.socketId}
                    photo={client.photo}
                    username={client.username}
                  />
                ))}
              </div>
            </div>
          </div>
          <iframe title="output" srcDoc={html} />
          <Editors
            socketRef={socketRef}
            roomId={location.state?.roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
              setHtml(code);
            }}
          />
          {/*<MyEditor />*/}
        </div>
      </Tilt>
    </main>
  );
};

export default EditorPage;
