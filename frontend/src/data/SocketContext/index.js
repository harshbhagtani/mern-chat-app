import { createContext, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import Peer from "simple-peer";
export const SocketContext = createContext();

// const socket = io('https://chatter-v8em.onrender.com');
const socket = io("http://localhost:3001");
function ContextProvider({ children, user }) {
  console.log(user, "hii");
  const [socketConnect, setSocketConnect] = useState(false);
  const [stream, setStream] = useState();
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [callAccepted, setCallAccepted] = useState(false);
  const [call, setCall] = useState({});

  useEffect(() => {
    if (user.user) {
      socket.emit("setup", user.user);
      socket.on("connected", () => {
        setSocketConnect(true);
      });
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          console.log(currentStream);
        });
      socket.on("callUser", ({ from, signal }) => {
        console.log("helll", from, signal);
        setCall({ isReceivingCall: true, from, signal });
      });
    }
  }, [user]);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signalData: data,
        to: call.from.user._id
      });
    });

    peer.on("stream", (currentStream) => {
      setCallAccepted(true);
      console.log("crr", currentStream);
      myVideo.current.srcObject = stream;
      userVideo.current.srcObject = currentStream;
    });

    console.log(call.signal, "helll");
    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: user
      });
    });

    peer.on("stream", (currentStream) => {
      console.log("crr", currentStream);
      myVideo.current.srcObject = stream;
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      console.log("heasklsam", signal);
      peer.signal(signal);
    });

    connectionRef.current = peer;

    console.log(id);
  };

  const leaveCall = () => {
    setCallAccepted(false);

    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        userVideo,
        callAccepted,
        myVideo,
        call,
        callUser,
        answerCall,
        setCall,
        setCallAccepted,
        leaveCall
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

function mapstateToProps(state) {
  return {
    user: state.auth
  };
}

export default connect(mapstateToProps)(ContextProvider);
