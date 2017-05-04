/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('QTable');
 * mod.thing == 'a thing'; // true
 */
 
var baseCreep = "2w2c2m";
var parts = 6;
var startQ = 1;
var actions = ["wc","wm","cw","cm","mw","mc",0,-1];

Memory.QTab = {};
var QTable = {
    
    
    initialize : function(){
        var w,c,m;
        Memory.QTab.harvester = {baseCreep : startQ};
        for (w=0;w<=parts;w++){
            for(c=0;c<=parts;c++){
                for(m=0;m<=parts;m++){
                    if(w+c+m == parts){
                        var index = w.toString() + "w" + c.toString() + "c" + m.toString() + "m";
                        if (index == baseCreep){
                            Memory.QTab.harvester[index] = 20;   
                        }else{
                            Memory.QTab.harvester[index] = startQ;
                        }
                    }
                }
            }
        }
    },
    
    update : function(){
        // Updates the reward after the life of the creep. 
                return true;

    },
    
    generateNewState : function(state, action){
        // Take the current state, and record the proper action.
        // return the new state
        if (action == 0){
            return Memory.QTab.harvester[state];
        } if (action == -1){
            return Memory.QTab.harvester[baseState];
        }
        var w = parseInt(state.charAt(0));
        var c = parseInt(state.charAt(2));
        var m = parseInt(state.charAt(4));
        var swapOut = action.charAt(0);
        var swapIn = action.charAt(1);
        if(swapOut == "w"){
            if (w==0){ return -1;}
            w--;
        }
        else if(swapOut == "c"){
            if (c==0){ return -1;}
            c--;
        }
        else if(swapOut == "m"){
            if (m==0){ return -1;}
            m--;
        }
        if (swapIn =="w"){
            if (w==6){return -1;}
            w++;
        }
        else if (swapIn =="c"){
            if (c==6){return -1;}
            c++;
        }
        else if (swapIn =="m"){
            if (m==6){return -1;}
            m++;
        }
        var newState = w.toString() + "w" + c.toString() + "c" + m.toString() + "m";
        return newState;

        // EX: [WORK, CARRY, MOVE, MOVE, MOVE] Swap -> [WORK, CARRY, MOVE, MOVE, CARRY]
    },
    
    startState : function(){
        return baseState;
    },
    
    getReward : function(state, action){
        //Take the state and action, return the reward from the qtab.
        if (action == 0){
            return Memory.QTab.harvester[state];
        } if (action == -1){
            return Memory.QTab.harvester[baseState];
        }
        var w = parseInt(state.charAt(0));
        var c = parseInt(state.charAt(2));
        var m = parseInt(state.charAt(4));
        var swapOut = action.charAt(0);
        var swapIn = action.charAt(1);
        if(swapOut == "w"){
            if (w==0){ return -1;}
            w--;
        }
        else if(swapOut == "c"){
            if (c==0){ return -1;}
            c--;
        }
        else if(swapOut == "m"){
            if (m==0){ return -1;}
            m--;
        }
        if (swapIn =="w"){
            if (w==6){return -1;}
            w++;
        }
        else if (swapIn =="c"){
            if (c==6){return -1;}
            c++;
        }
        else if (swapIn =="m"){
            if (m==6){return -1;}
            m++;
        }
        var newState = w.toString() + "w" + c.toString() + "c" + m.toString() + "m";
        return Memory.QTab.harvester[newState];
    },
    
    softmax : function(){
        // use Softmax equation to choose the next action
                return true;

    }
    
    
    
}

module.exports = QTable;