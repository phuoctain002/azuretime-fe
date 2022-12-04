import { useEffect } from 'react/cjs/react.production.min';
import { Server } from 'socket.io';

const io = new Server({
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('Someone has connected');
    

    socket.on('disconnect', () => {
        console.log('Someone has left');
    });
});
