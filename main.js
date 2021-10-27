// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

    // setup some minimum numbers for different roles
    var minimumNumberOfHarvesters = 10;
    var minimumNumberOfUpgraders = 1;
    var minimumNumberOfBuilders = 1;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        var name = `Harvester${Game.time}`
        var spawnAttempt = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], name,
            { memory: { role: 'harvester', working: false } });
        // print name to console if spawning was a success
        if (spawnAttempt === OK) {
            console.log(`Spawning new creep: ${name}`)
        }
    }
    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        var name = `Upgrader${Game.time}`
        var spawnAttempt = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE, MOVE], name,
            { memory: { role: 'upgrader', working: false } });
        // print name to console if spawning was a success
        if (spawnAttempt === OK) {
            console.log(`Spawning new creep: ${name}`)
        }
    }
    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        var name = `Builder${Game.time}`
        var spawnAttempt = Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, MOVE], name,
            { memory: { role: 'builder', working: false } });
        // print name to console if spawning was a success
        if (spawnAttempt === OK) {
            console.log(`Spawning new creep: ${name}`)
        }
    }
    else {
        // else try to spawn a builder
        var name = `Builder${Game.time}`
        var spawnAttempt = Game.spawns.Spawn1.spawnCreep([WORK, WORK, CARRY, MOVE], name,
            { memory: { role: 'builder', working: false } });
        // print name to console if spawning was a success
        if (spawnAttempt === OK) {
            console.log(`Spawning new creep: ${name}`)
        }
    }
};