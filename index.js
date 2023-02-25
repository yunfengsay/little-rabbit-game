import {Canvas} from './modules/canvas.js'
// Create a new Peer object for each client
// const peer = new Peer({
//   host: 'your-peerjs-server.com',
//   port: 9000,
//   path: '/myapp'
// });
const peer = new Peer(null, {
  debug: 2
});

