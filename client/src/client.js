
const bet = document.getElementById('betray');
const coo = document.getElementById('cooperate');
const defColor = "white";

const click = (button) => {
  //console.log("Clicked on " + button.id);
  button.style.backgroundColor = 'green';
  button.disabled = true;
}; 

const unclick = (button) => {
  //console.log("Unclicked " + button.id)
  button.style.backgroundColor = defColor
  button.disabled = false;
  //button.style.backgroundColor = defColor;
  
};

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
};
// To be changed
const addButtonListeners = () => {
  choices = {'betray': 'cooperate', 'cooperate': 'betray'};
  for(const [id, opid] of Object.entries(choices)){
    const button = document.getElementById(id);
    console.log("Button ID: " + button.id);
    button.addEventListener('click', () => {
      sock.emit('turn', id);
      click(button);
      //Unclick the other button.
      unclick(document.getElementById(opid));
    });
  };
};


writeEvent('Welcome to the Game of Betrayal!');

const sock = io();

function create() {
  //console.log("fired");
  //console.log(window.location.search)
  sock.emit('room', window.location.search);
}
// Waiting for players
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