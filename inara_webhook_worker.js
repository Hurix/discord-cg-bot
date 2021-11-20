const { MessageEmbed, WebhookClient } = require('discord.js');
const InaraAPI = require('./inara.js');
const { inaraAPIKey, webhookId, webhookToken } = require('./auth.json');

const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });
const inara = new InaraAPI({
	appName: "ED CG-Viewer for Discord",
	appVersion: "1.0.0",
	isBeingDeveloped: true,
	APIkey: inaraAPIKey
});

const embedCGData = cgdata => {
    var embed = new MessageEmbed()
		.setTitle(cgdata.communitygoalName)
		.setDescription(cgdata.goalObjectiveText)
		.setColor(cgdata.isCompleted ? 0 : '#EF7B04')
		.addFields(
			{ name: 'System', value: `${cgdata.starsystemName}`, inline: true },
			{ name: 'Station', value: `${cgdata.stationName}`, inline: true },
			{ name: 'Status', value: (cgdata.isCompleted?"FINISHED":"ONGOING"), inline: true },
			{ name: 'Progress', value: `Tier ${cgdata.tierReached}/${cgdata.tierMax}`, inline: true },
			{ name: 'CMDRs', value: `${cgdata.contributorsNum}`, inline: true },
			{ name: 'Contributions', value: `${cgdata.contributionsTotal}`, inline: true }
		)
	if (!cgdata.isCompleted) embed.setURL(cgdata.inaraURL)
	return embed
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function equalEmbeds(a, b) {
	var diffs = true
	if (a.length != b.length) return false
	for (var i=0; i<a.length; i+=1) {
		var akey = (a[i].title + a[i].description)
		for(var j in Object.keys(a[i].fields)) {
			if (a[i].fields[j].name == 'System') akey += a[i].fields[j].value
		}		
		for(var j in Object.keys(a[i].fields)) {
			if (a[i].fields[j].name == 'Station') akey += a[i].fields[j].value
		}
		var bkey = (b[i].title + b[i].description)
		for(var j in Object.keys(b[i].fields)) {
			if (b[i].fields[j].name == 'System') bkey += b[i].fields[j].value
		}		
		for(var j in Object.keys(b[i].fields)) {
			if (b[i].fields[j].name == 'Station') bkey += b[i].fields[j].value
		}
		//console.log(akey, bkey)
		if (akey !== bkey)
				diffs = false
	}
	return diffs
}
var MAX_RETRYS = 5
var retrys = 0
async function work() {
	var lastmsg;
	var i = 0;
	while(true) {
		inara.testdata = require(`./testdata${i}.json`)
		i+=1
		if (i>4) i=0
		var cgdata = inara.getCommunityGoalsRecent()//.then(cgdata => {
			if (cgdata.eventStatus === 200) {
				let embeds = []
				cgdata.eventData.map((eventData) => embeds.push(embedCGData(eventData)))
				
				if (lastmsg && equalEmbeds(lastmsg.embeds, embeds)) {
					lastmsg = await webhookClient.editMessage(lastmsg, {
						embeds: embeds
					})
				} else {
					lastmsg = await webhookClient.send({
						embeds: embeds
					})
				}
				retrys = 0
			}
			else {
				console.log("error", cgdata)
				break
			}
		//}).catch(error => {
		//	console.error('INARA Error: ', error);
		//})
		await sleep(0.25*60*1000)
	}
	retrys += 1
	if (retrys < MAX_RETRYS) setTimeout(work, retrys*retrys*0.1*60*1000)
}
work()