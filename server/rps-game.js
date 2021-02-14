
class RpsGame {

  constructor(players) {

    this._names = players.map(p => p.name);
    this._players = players.map(p=> p.it);
    this._games = this._combination(this._range(0, this._names.length));
    this._scores = Array.apply(null, new Array(players.length)).map(_ =>0);
    this._turns = Array.apply(null, new Array(players.length)).map(_ => null);
    this._turn = 1;
    this._sendToPlayers('The game of trust begins!');
    this._sendToPlayers('Turn 1: Make your choice');
    this._players.forEach((x) => x.emit('bReset'));
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
    });
  }
  // Copied from https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
  _range (start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
  }

  // Takes in a list and returns all available combinations (pairs only).
  _combination(list){
    var out = [];
    for(var i=0;i<list.length;i++){
      for(var j=i+1;j<list.length;j++){
        out.push([list[i],list[j]]);
      }
    }
  return out      
  }
  

  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }

  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    //this.players[playerIndex].
    this._sendToPlayer(playerIndex, `You choose to ${turn}`);

    this._checkGameOver();
  }

  
  _checkGameOver() {
    
    const turns = this._turns;

    if (this._turns.every((x)=>x)) {
      //this._sendToPlayers('Game over ' + turns.join(' : '));
      
      this._getGameResult();
      this._turns = Array.apply(null, new Array(this._players.length)).map(_ => null);
      this._turn ++;
      this._sendToPlayers(`Turn ${this._turn}: Make your choice!`);
      
    }
  }

  _getGameResult() {
    // Gets all choices from all players.
    const choices = this._turns.map(this._decodeTurn);
    //console.log(choices);
    //const combChoices = this._combination(choices);
    /*
    Returns the updated score board.
    :params:
    one: Index of the first player.
    two: Index of the second player.
    ones: The number used to determine how much to increase/decrease Player 1's score.
    twos: The number used to determine how much to increase/decrease Player 2's score.
    */

    const AupdatedScore = (one, ones, two, twos) => [this._scores[one]+ones, this._scores[two]+=twos]
    
    const updatedScore = (one, ones, two, twos) => {
      this._scores[one]+=ones 
      this._scores[two]+=twos
    };
    //Copied from https://stackoverflow.com/questions/22015684/how-do-i-zip-two-arrays-in-javascript
    const zip = (a, b) => a.map((k, i) => [k, b[i]]);
    
    // p0: Index of the first player.
    // p1: Index of the second player.
    const updateScore = (o, t) => {
      // 0 = betray
      // 1 = cooperate
      const p0 = choices[o];
      const p1 = choices[t];

      //Distance is used to determine the outcome of two choices.
      const distance = p1 + p0;
      //console.log(`Player ${o}'s choice: ${p0}`);
      //console.log(`Player ${t}'s choice: ${p1}`);
      switch (distance) {
        case 0:
          this._sendToPlayers('Both Players have betrayed each other!');
          updatedScore(o, -1, t, -1);
          break;

        case 1:
          if(p0 == 0){
            this._sendWinMessage(this._players[0], this._players[1])
            updatedScore(o, 3, t, -2);
          }  
          else{
            this._sendWinMessage(this._players[1], this._players[0])
            updatedScore(o, -2, t, 3);
          }
          break;

        case 2:
          this._sendToPlayers('Both Players have cooperated!');
          updatedScore(o, 2, t, 2);
          break;
      }
    }
    this._players.forEach((x) => x.emit('bReset'));
    console.log(this._scores);
    console.log(this._games);
    this._games.forEach((x)=> updateScore(x[0], x[1]));
    this._sendToPlayers('Scores:');
    zip(this._names, this._scores).forEach((x) => this._sendToPlayers(x[0]+ `: ${x[1]}`));
    //this._sendToPlayers(this._names[0] + `: ${this._scores[0]}`);
    //this._sendToPlayers(this._names[1] + `: ${this._scores[1]}`);
    }
  

  _sendWinMessage(winner, loser) {
    winner.emit('message', 'Betrayal Successful!');
    loser.emit('message', 'Cooperation Failed.');
  }

  _decodeTurn(turn) {
    switch (turn) {
      case 'betray':
        return 0;
      case 'cooperate':
        return 1;
      default:
        throw new Error(`Could not decode turn ${turn}`);
    }
  }
}



module.exports = RpsGame;
