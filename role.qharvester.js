/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.qharvester');
 * mod.thing == 'a thing'; // true
 */

var chargeMethods = require('methods.charge');
 
var roleQHarvester = {
    
    create : function(spawn, state) {
        var srcs = spawn.room.find(FIND_SOURCES);
        
        var w = parseInt(state.charAt(0));
        var c = parseInt(state.charAt(2));
        var m = parseInt(state.charAt(4));
        var body = [];
        
        var i;
        for (i=0;i<w;i++){
            body.push(WORK);
        }
        for (i=0;i<c;i++){
            body.push(CARRY);
        }
        for (i=0;i<m;i++){
            body.push(MOVE);
        }
        
        var creep = spawn.createCreep(body, {role : 'qharvester', new : true, node : srcs[0].id, stateStr : state, deposited : 0});
    },
    
    run : function(creep) {
        
        if (!creep.memory.depositing) {
            if (creep.carry.energy < creep.carryCapacity) {
                if (creep.harvest(Game.getObjectById(creep.memory.node)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.node));
                } 
            }
            else {
                creep.memory.depositing = true;
                creep.say("depositing");
            }
        } else {
            if (creep.carry.energy == 0) {
                creep.say("gathering");
                creep.memory.depositing = false;
                creep.memory.deposited += creep.carryCapacity;
            } else if (!chargeMethods.stdCharge(creep)) {
                chargeMethods.upgradeController(creep);
                creep.memory.deposited += creep.carryCapacity;
            }
        }
        
    }
    
}

module.exports = roleQHarvester;