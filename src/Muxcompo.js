import React, { useEffect, useState, useRef } from 'react';
// import { w3cwebsocket as W3CWebSocket } from "websocket";
import socketIOClient from "socket.io-client";

const CAMERA_CONSTRAINTS = {
  audio: true,
  video: { width: 960, height: 540 }
};

export default (props) => {
  const socket = props.socket
  const [connected, setConnected] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState(null);
  const [shoutOut, setShoutOut] = useState('you');
  // const [socket, setSocket] = useState();

const ENDPOINT = "http://localhost:8080/";
//   useEffect(() => {
//     const sockett = socketIOClient(ENDPOINT, { transports : ['websocket'] });
//     console.log("socket",sockett)

//     setSocket(socket)
  
//     ffmpegpass
//   }, []);
// useEffect(() => {
//     if(socket){

//     }
//     ffmpegpass
//   });
  const inputStreamRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const wsRef = useRef();
  const mediaRecorderRef = useRef();
  const requestAnimationRef = useRef();
  const nameRef = useRef();

  const enableCamera = async () => {
    inputStreamRef.current = await navigator.mediaDevices.getUserMedia(
      CAMERA_CONSTRAINTS
    );

    videoRef.current.srcObject = inputStreamRef.current;

    await videoRef.current.play();

    // We need to set the canvas height/width to match the video element.
    canvasRef.current.height = videoRef.current.clientHeight;
    canvasRef.current.width = videoRef.current.clientWidth;

    requestAnimationRef.current = requestAnimationFrame(updateCanvas);

    setCameraEnabled(true);
  };

  const updateCanvas = () => {
    if (videoRef.current.ended || videoRef.current.paused) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');

    ctx.drawImage(
      videoRef.current,
      0,
      0,
      videoRef.current.clientWidth,
      videoRef.current.clientHeight
    );

    ctx.fillStyle = '#ff0000';
    ctx.font = '50px monospace';
    ctx.fillText(`Oh hi, ${nameRef.current}`, 5, 50);



    requestAnimationRef.current = requestAnimationFrame(updateCanvas);


   
  };

  const stopStreaming = () => {
    mediaRecorderRef.current.stop();
    setStreaming(false);
  };


  const startStreaming = async() => {
    setStreaming(true);
// const socket = await socketIOClient(ENDPOINT, { transports : ['websocket'] });
    await socket.emit("startStreaming", { "key": streamKey });
      setConnected(true);
var ffmp;
   await  socket.on("ffmpegpass",function(data){
    console.log("data----------",data)
 
     });
    // wsRef.current = new W3CWebSocket(
    //   `${protocol}//localhost:8080/rtmp?key=${streamKey}`
    // );
    // wsRef.current = io(`${protocol}//localhost:8080/rtmp?key=${streamKey}`);
   
    // wsRef.current.addEventListener('open', function open() {
    //   setConnected(true);
    // });

    // wsRef.current.addEventListener('close', () => {
    //   setConnected(false);
    //   stopStreaming();
    // });

    const videoOutputStream = canvasRef.current.captureStream(30); // 30 FPS

   const audioStream = new MediaStream();
    const audioTracks = inputStreamRef.current.getAudioTracks();
    audioTracks.forEach(function(track) {
      audioStream.addTrack(track);
    });

    const outputStream = new MediaStream();
    [audioStream, videoOutputStream].forEach(function(s) {
        s.getTracks().forEach(function(t) {
            outputStream.addTrack(t);
        });
    });


    mediaRecorderRef.current = new MediaRecorder(outputStream, {
      mimeType: 'video/webm',
      videoBitsPerSecond: 3000000
    });

    mediaRecorderRef.current.addEventListener('dataavailable', e => {
      socket.emit("passDatatoStreaming", {'data':e.data,'ffmpeg':"","streamKey":streamKey});
    });

    mediaRecorderRef.current.addEventListener('stop', () => {
      stopStreaming();
      // wsRef.current.close();
    });

    mediaRecorderRef.current.start(1000);
    // Let's do some extra work to get audio to join the party.
    // https://hacks.mozilla.org/2016/04/record-almost-everything-in-the-browser-with-mediarecorder/
   
  };
 

  useEffect(() => {
    nameRef.current = shoutOut;
  }, [shoutOut]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationRef.current);
    }
  }, []);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
     
      <h1>Streamr</h1>

      {!cameraEnabled && (
        <button className="button button-outline" onClick={enableCamera}>
          Enable Camera
        </button>
      )}

      {cameraEnabled &&
        (streaming ? (
          <div>
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
            <button className="button button-outline" onClick={stopStreaming}>
              Stop Streaming
            </button>
          </div>
        ) : (
          <>
            <input
              placeholder="Stream Key"
              type="text"
              onChange={e => setStreamKey(e.target.value)}
            />
            <button
              className="button button-outline"
              disabled={!streamKey}
              onClick={startStreaming}
            >
              Start Streaming
            </button>
          </>
        ))}
      <div className="row">
        <div className="column">
          <h2>Input</h2>
          <video ref={videoRef} controls width="100%" height="auto" muted></video>
        </div>
        <div className="column">
          <h2>Output</h2>
          <canvas ref={canvasRef}></canvas>
          <input
            placeholder="Shout someone out!"
            type="text"
            onChange={e => setShoutOut(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
