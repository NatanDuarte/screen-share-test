// components/RoomList.tsx

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ListContainer, RoomItem } from './styles';

const RoomList: React.FC = () => {
    const [rooms, setRooms] = useState<string[]>([]);
    const socket = io('http://localhost:3000'); // Conecte-se ao servidor Socket.io

    useEffect(() => {
        // Quando o componente montar, obtenha a lista de salas disponíveis
        socket.emit('getRoomList');

        // Ouça por atualizações na lista de salas
        socket.on('updateRoomList', (roomList: string[]) => {
            setRooms(roomList);
        });

        return () => {
            // Ao desmontar o componente, desconecte o socket
            socket.disconnect();
        };
    }, []);

    const joinRoom = (roomId: string) => {
        // Ao clicar em uma sala, redirecione o usuário para essa sala ou implemente sua lógica
        console.log(`Joining room ${roomId}`);
        // Você pode adicionar aqui a lógica para redirecionar o usuário para a sala ou outra ação relacionada à entrada na sala.
    };

    return (
        <ListContainer>
            <h2>Rooms Available:</h2>
            {rooms.map((roomId) => (
                <RoomItem key={roomId} onClick={() => joinRoom(roomId)}>
                    Room: {roomId}
                </RoomItem>
            ))}
        </ListContainer>
    );
};

export default RoomList;
