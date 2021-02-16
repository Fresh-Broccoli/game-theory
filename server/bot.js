class Bot{
    //m: Mode
    //room: Room number
    constructor(m, room){
        var modes = {
            'T':this._titForTat, 
            'NT': this._notTitForTat,
            'R':this._rand,
            'B':this._alwaysB,
            'C':this._alwaysC
        };
        //this.mode = m;
        this._choices = ['betray', 'cooperate'];
        Bot.increment();
        this._sock = io(`http://localhost:8080/index2.html?Bot${room}/Bot${Bot._no}`);
        this._sock.on('message', (msg) => {
            this._sock.emit('turn', modes[m]());
        });


    }

    static _no = 0;

    static increment(){
        Bot._no ++
    }

    //Input for all modes should be a string - either 'betray' or 'cooperate'.
    _titForTat(om){
        if(om){
            return om;
        }
        return this._rand(om);
    }

    _notTitForTat(om){
        return om===this._choices[0]?this._choices[0]:this._choices[1];
    }

    _rand(_){
        return this._choices[Math.round(Math.random)];
    }

    _alwaysB(_){
        return this._choices[0];
    }

    _alwaysC(_){
        return this._choices[1];
    }

    

}