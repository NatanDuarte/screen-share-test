import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Container, Video, VideoContainer } from './styles';
import RoomList from '../RoomList';


const ScreenSharing: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any | null>(null);
  const room = 1234;

  const initScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia();
      setStream(stream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }

      // Initialize Socket.io connection
      socket.current = io('http://localhost:3000');

      socket.current.emit('joinRoom', room);

      // Send the stream to the server
      if (socket.current) {
        socket.current.emit('startScreenSharing', room, stream);
      }
    } catch (error) {
      console.error('Error accessing screen sharing:', error);
    }
  };

  const stopScreenSharing = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (socket.current) {
      socket.current.emit('stopScreenSharing', room);
      socket.current.disconnect();
    }
    setStream(null);
  };

  useEffect(() => {
    initScreenSharing();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    <Container>
      <h1>Screen Sharing</h1>
      <VideoContainer>
        <Video controls ref={userVideoRef} autoPlay muted />
      </VideoContainer>
      {stream ? (
        <button onClick={stopScreenSharing}>Stop Screen Sharing</button>
      ) : (
        <button onClick={initScreenSharing}>Start Screen Sharing</button>
      )}
      <RoomList />
    </Container>
  );
};

export default ScreenSharing;