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
    
    create : function(spawn, state, mig) {
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
        
        if (spawn.canCreateCreep(body) == 0) {
            let migrating = mig;
            if (mig > 1) {
                Memory.migrating++;
            }
            spawn.createCreep(body, {role : 'qharvester', new : true, node : srcs[0].id, stateStr : state, deposited : 0, 
                                    migrating : migrating, prevQ : Memory.QTab.harvester[state]});
        }
        
        
    },
    
    run : function(creep) {
        if (creep.memory.migrating == 2) {
            var p = new RoomPosition(25, 45, 'W7N4');
            creep.moveTo(p);
            if (creep.pos.x == p.x && creep.pos.y == p.y) { 
                Memory.migrating = Memory.migrating - 1;
                creep.memory.migrating = 0;
                creep.memory.node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0)}).id;
            }
            else { return; }
        }
        
        if (!creep.memory.depositing) {
            if (creep.carry.energy < creep.carryCapacity) {
                if (creep.harvest(Game.getObjectById(creep.memory.node)) == ERR_NOT_IN_RANGE) {
                    if (creep.moveTo(Game.getObjectById(creep.memory.node)) == ERR_NO_PATH) {
                        var node = creep.pos.findClosestByPath(FIND_SOURCES, {filter : (s) => (s.energy > 0)});
                        if (node) {
                            creep.memory.node = node.id;
                        }
                    }
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
            }
        }
        
    }
    
}

module.exports = roleQHarvester;