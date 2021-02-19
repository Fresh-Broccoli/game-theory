const bet = document.getElementById('betray');
const coo = document.getElementById('cooperate');
const defColor = "white";
let playerName = null;

const click = (button) => {
  button.style.backgroundColor = 'green';
  button.disabled = true;
}; 

const unclick = (button) => {
  //console.log("Unclicked " + button.id)
  button.style.backgroundColor = defColor
  button.disabled = false;
  //button.style.backgroundColor = defColor;
};

const resetButtons = () => {
  unclick(bet);
  unclick(coo);
}

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
    //console.log("Button ID: " + button.id);
    button.addEventListener('click', () => {
      //console.log("XD")
      sock.emit('turn', id);
      //Click the current buttons.
      click(button);
      //Unclick the other button.
      unclick(document.getElementById(opid));
    });
  };
};

const createButton = () => {
  var button = document.createElement("button");
  //button.style = "position:absolute;top:70px;";
  button.className = "float-left submit-button";
  button.innerHTML = "Start!";

// 2. Append somewhere
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(button);

// 3. Add event handler
  button.addEventListener ("click", function() {
  sock.emit('startGame', "xd");
  //sock.on("started", (_) => {
  sock.on("started", (_) => {
    button.disabled = true;
    button.style.backgroundColor = "red";
  })
  
});
}


writeEvent('Welcome to the Game of Betrayal!');

const sock = io();

function create() {
  sock.emit('room', window.location.search);
}
// Waiting for players
sock.on('message', writeEvent);
sock.on('name', (n)=>{
  playerName = n;
  console.log(`Name received: ${n}.`)
})
sock.on('first', createButton);
sock.on('bReset', resetButtons);
sock.on('redirect', (dest) => window.location.href = dest);
sock.on('updateLB', (x) => {
  for(var i = 1;i<=5;i++){
    // Name
    const n = document.getElementById(`r${i}n`);
    // Score
    const s = document.getElementById(`r${i}s`);

    if(i===4){
      
      n.innerHTML = `${x[i-1]} other player/s ${(x[i][0]=== ' ')?"below":"in-between"}`
    }   
    else{
      console.log(playerName)
      n.innerHTML = ((i===5 && x[i-1][0] !== ' ') || (i<=3 && playerName == x[i-1][0]))?"You":x[i-1][0];
      s.innerHTML = x[i-1][1];
    }
  }
})
sock.on('disconnectEvent', (text) => {
  disconnected();
});



const chF = document.querySelector('#chat-form')

if(chF){chF.addEventListener('submit', onFormSubmitted);}
addButtonListeners();

const idF = document.querySelector('#id-form');

if(idF){idF.addEventListener('submit', onIDSubmitted)};
