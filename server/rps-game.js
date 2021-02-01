
class RpsGame {

  constructor(p1, p2) {
    this._players = [p1, p2];
    this._scores = [0, 0];
    this._turns = [null, null];
    this._turn = 1;
    this._sendToPlayers('The game of trust begins!');
    this._sendToPlayers('Turn 1: Make your choice');
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
    });
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
    this._sendToPlayer(playerIndex, `You choose to ${turn}`);

    this._checkGameOver();
  }

  _checkGameOver() {
    const turns = this._turns;

    if (turns[0] && turns[1]) {
      //this._sendToPlayers('Game over ' + turns.join(' : '));
      this._getGameResult();
      this._turns = [null, null];
      this._turn ++;
      this._sendToPlayers(`Turn ${this._turn}: Make your choice!`);
      
    }
  }

  _getGameResult() {

    const p0 = this._decodeTurn(this._turns[0]);
    const p1 = this._decodeTurn(this._turns[1]);

    /*
    Returns the updated score board.
    :params:
    one: The number used to determine how much to increase/decrease Player 1's score.
    two: The number used to determine how much to increase/decrease Player 2's score.
    */
    const updatedScore = (one, two) => [this._scores[0] + one, this._scores[1] + two]

    // 0 = betray
    // 1 = cooperate
    const distance = p1 + p0;
  
    switch (distance) {
      case 0:
        this._sendToPlayers('Both Players have betrayed each other!');
        this._scores = updatedScore(-1, -1);
        break;

      case 1:
        if(p0 == 0){
          this._sendWinMessage(this._players[0], this._players[1])
          this._scores = updatedScore(3, -2);
        }  
        else{
          this._sendWinMessage(this._players[1], this._players[0])
          this._scores = updatedScore(-2, 3);
        }
        break;

      case 2:
        this._sendToPlayers('Both Players have cooperated!');
        this._scores = updatedScore(2,2);
        break;
    }
    this._sendToPlayers('Scores:');
    this._sendToPlayers(`Player 1: ${this._scores[0]}`);
    this._sendToPlayers(`Player 2: ${this._scores[1]}`);
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
