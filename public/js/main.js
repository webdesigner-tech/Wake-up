const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');



// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});



//Audio that will play on receiving messages(for incoming msg )
var audi =new Audio('ring.mp3.mp3');
var audio =new Audio('2.mp3.mp3');


const socket = io();

// Join chatroom or // Send to server
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('mes', m => {
  console.log(m);
  output(m,'ser');

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});




// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message,'incoming');

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message from server
socket.on('mess', message => {
  console.log(message);
  outputMessage(message,'outgoing');

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message from server
socket.on('leave', m => {
  console.log(m);
  output(m,'ser');

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});




// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server // // Send to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


// Output message to DOM
function outputMessage(message , type) {
  const div = document.createElement('div');
  let className = type
  div.classList.add(className, 'message');
  const p = document.createElement('p');
  p.classList.add(className, 'meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add( 'text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
  
  if (type=='incoming'){
    audi.play();
  }
  if(type=='outgoing'){
      audi.play();
   }


}



// Output message to DOM
function output(m , type) {
  const div = document.createElement('div');
  let className = type
  div.classList.add(className, 'message');
  const p = document.createElement('p');
  p.classList.add(className, 'meta');
  p.innerText = m.username;
  p.innerHTML += `<span>${m.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add( 'text');
  para.innerText = m.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
  if (type=='ser'){
    audio.play();
  }
 
}


// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }
