if(process.argv.length < 3){
	console.log('USAGE: node gen-bracket.js bracket-name');
	process.exit(1);
}

var fs = require('fs');

var bracket = {
	"name": process.argv[2],
	"matches": {}
}

var round1TeamSeeds = [
	[16,1], [8,9], [5,12], [4,13], [6,11], [3,14], [7,10], [2,15]
];

var createMatchObject = function(matchId, roundId, regionId, team1Id, team2Id, nextMatchId){
	bracket.matches["match-" + matchId] = {
		"id": matchId,
		"round_id": roundId,
		"region_id": regionId,
		"teams": [team1Id, team2Id],
		"teams_are_real": true,
		"selected_team_id": null,
		"next_match_id": nextMatchId,
		"status": "pre-round",
		"pick_enabled": true,
		"pick_lock_reason": null,
		"current_point": 100,
		"switching_point": 60,
		"start_time": null,
		"timer_type": null,
		"timer_name": null,
		"timer_value": null
	};
}

// round-1 matches
var matchId = 1, nextMatchId = 33;
for (var regionId = 1; regionId <= 4; regionId++) {
	for (var i = 0; i < round1TeamSeeds.length; i++) {
		var team1Id = ((regionId -1) * 16) + round1TeamSeeds[i][0];
		var team2Id = ((regionId -1) * 16) + round1TeamSeeds[i][1]; 
		
		createMatchObject(matchId, 1, regionId, team1Id, team2Id, nextMatchId);
		if (matchId % 2 === 0) {
			nextMatchId++;
		}		
		matchId++;
	}
};


// round-2 matches
for (var regionId = 1; regionId <= 4; regionId++) {
	for(var i=1; i<=4; i++){
		createMatchObject(matchId, 2, regionId, null, null, nextMatchId);
		if (matchId % 2 === 0) {
			nextMatchId++;
		}
		matchId++;
	}
};

// round-3 matches
for (var regionId = 1; regionId <= 4; regionId++) {
	for(var i=1; i<=2; i++){
		createMatchObject(matchId, 3, regionId, null, null, nextMatchId);
		if (matchId % 2 === 0) {
			nextMatchId++;
		}
		matchId++;
	}
};

// round-4 matches
for (var regionId = 1; regionId <= 4; regionId++) {
	createMatchObject(matchId, 4, regionId, null, null, nextMatchId);
	if (matchId % 2 === 0) {
		nextMatchId++;
	}
	matchId++;
};

// round-5 matches

for (var regionId = 5; regionId <= 6; regionId++) {
	createMatchObject(matchId, 5, regionId, null, null, nextMatchId);
	if (matchId % 2 === 0) {
		nextMatchId++;
	}
	matchId++;
};

createMatchObject(matchId, 6, null, null, null, null);

console.log(JSON.stringify(bracket,null,"\t"));

	