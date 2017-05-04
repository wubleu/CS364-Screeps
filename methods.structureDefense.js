/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('methods.structureDefense');
 * mod.thing == 'a thing'; // true
 */
 
 
    
var towerAttackNearest = function(tower, index, array) {
    var nearestCreep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    tower.attack(nearestCreep);
}

var structureDefense = {
    
    towersDefend : function(room) {
        var towers = room.find(FIND_MY_STRUCTURES, {filter : (s) => (s.structureType == STRUCTURE_TOWER)});
        towers.forEach(towerAttackNearest);
    }

};


module.exports = structureDefense;