// import logo from './logo.svg';
// import MuxCompo from "./Muxcompo"
// import Chatwebsoket from "./Chatwebsoket"
// function App() {
//   return (
//     <div>
//  <MuxCompo/> 
// {/* <Chatwebsoket/>*/}
//     </div>
//   );
// }

// export default App;

import {useState,useEffect} from "react";
import MuxCompo from "./Muxcompo"
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:8080/";

function App() {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT, { transports : ['websocket'] });
    setSocket(socket)
    console.log("socket",socket)
    socket.on("FromAPI", data => {
      console.log(data);
    });
  }, []);

  return (
    <>
    <p>
      It's 
      
    </p>

    {socket ?<MuxCompo socket={socket} />  : null} 
    </>
  );
}

 export default App;