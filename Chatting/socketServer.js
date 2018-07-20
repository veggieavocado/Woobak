
// for chatting
const server = require('http').createServer();
const io = require('socket.io')(server);
const ClientManager = require('./ClientManager').ClientManager;
const ChatRoom = require('./ChatRoom');

const CM = new ClientManager();
let ChatRooms = [ChatRoom];
function handleRegister(userName, callback) {
  CM.isUserAvailable(userName, (res, err) => {
    console.log('response!');
    if( err == 400){
      return callback('BAD', 400);
    }
    
      return callback('GOOD', 200);
    
  });
}

function handleAccessTry(callback) {
  console.log('Client tried to access (handleaccesstry)');
  if (CM.length !== 3000) {
    return callback('Overflow', 400);
  }
  return callback('OKAY', 200);
}

function handleGetChatrooms(callback) {
  for (i in ChatRooms) {
    var mock = [ChatRoom];
    mock.push(i);
  }
  if (ChatRooms.length == 0) {
    console.log('No Chat room');
    callback("No chat room', 400");
  } else {
    callback(mock, 200);
  }
}

function handleCreateChatRoom(ChatRoomName, callback) {
  // if chatroom name is already here
  for (i in ChatRooms) {
    if (i.ChatRoomName == ChatRoomName) {
      callback('ChatRoom is already exists.', 400);
    }
    ChatRooms.push(new ChatRoom(ChatRoomName));
    cllback('ChatRoom is Okay! I made it.', 200);
    
  }
  // or chatroom members are already made chatroom,
  // Do not make Chatroom!
}

io.on('connection', (client) => {
  console.log('client is online');
  client.on('register', handleRegister);

  client.on('CanIAccess', handleAccessTry);

  // client.on('join', handleJoin);
  client.on('CreateChatRoom', handleCreateChatRoom);
  // client.on('leave', handleLeave);

  // client.on('message', handleMessage);

  client.on('chatrooms', handleGetChatrooms);

  // client.on('availableUsers', handleGetAvailableUsers);

  client.on('disconnect', () => {
    console.log('client disconnect...', client.id);
    // handleDisconnect();
  });

  client.on('error', (err) => {
    console.log('received error from client:', client.id);
    console.log(err);
  });
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log('listening on port 3000');
});
