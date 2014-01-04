var fs = require('fs');

var regions = JSON.parse(fs.readFileSync(__dirname + "/regions.json"));

var teamId = 1;
var teams = {};
for (var regionId=1; regionId<=4; regionId++) {
	var seed =1;
	for (var seed=1; seed<=16; seed++) {
		teams["team-" + teamId] = {
			"id": teamId,
			"region_id": regionId,
			"regional_seed": seed,
			"name": (regions["region-" + regionId].name + " " + seed),
			"short_name": (regions["region-" + regionId].short_name + " " + seed)
		}
		teamId++;
	}
}

console.log(JSON.stringify(teams,null,"\t"));

	