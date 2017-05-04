/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('QTable');
 * mod.thing == 'a thing'; // true
 */
 
 
var QTable = {
    
    var baseState = [WORK, CARRY, MOVE, MOVE, MOVE];
    
    initialize : function(){
        
        Memory.harvester.QTab = {'[WORK, CARRY, MOVE, MOVE, MOVE]|Add' : 1, 'WCMMMSwap' : 1, };
        
    }
    
    update : function(){
        // Updates the reward after the life of the creep. 
    }
    
    generateNewState : function(state, action){
        // Take the current state, and record the proper action.
        // return the new state
        
        // EX: [WORK, CARRY, MOVE, MOVE, MOVE] Swap -> [WORK, CARRY, MOVE, MOVE, CARRY]
    }
    
    startState : function(){
        return baseState;
    }
    
    getReward : function(state, action){
        //Take the state and action, return the reward from the qtab. 
    }
    
    softmax : function(){
        // use Softmax equation to choose the next action
    }
    
    
    
}

module.exports = QTable;