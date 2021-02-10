


const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');
  
  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  //console.log(text);
  input.value = '';

  sock.emit('message', text);
};

const onIDSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat1');
  const text = input.value;
  //console.log(text);
  input.value = '';

  sock.emit('room', text);
};

const disconnected = () => {
  writeEvent('Opponent Disconnected')
}

const addButtonListeners = () => {
  ['betray', 'cooperate'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      sock.emit('turn', id);
    });
  });
};

writeEvent('Welcome to RPS');

const sock = io();

function create() {
  console.log("fired");
  console.log(window.location.search)
  sock.emit('room', window.location.search);
}

sock.on('message', writeEvent);
sock.on('disconnectEvent', (text) => {
  disconnected();
});

document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);

addButtonListeners();

document
  .querySelector('#id-form')
  .addEventListener('submit', onIDSubmitted);

addButtonListeners();