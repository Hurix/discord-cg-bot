'use strict';

const fetch = require('node-fetch');

class InaraAPI {
    #INARA_API_URL = "https://inara.cz/inapi/v1/"
    #header = {}
    constructor(options) {
        this.#header = {
            "appName": options.appName,
            "appVersion": options.appVersion,
            "isBeingDeveloped": options.isBeingDeveloped ? true : false,
            "APIkey": options.APIkey
        }
    }
    #api = async events => {
        const responseData = await fetch(this.#INARA_API_URL, {
            method: 'post',
            body: JSON.stringify({"header": this.#header, "events": events}),
            headers: { "Content-Type": 'application/json' }
        }).then(response => response.json())
        
        //console.log("api data: ", responseData)
        if (!responseData.header || responseData.header.eventStatus != 200) {
            console.error('INARA API Error: ', JSON.stringify(responseData.header))
        }
        return responseData // { header: { eventStatus: xxx }, events: []}
    }
    getCommunityGoalsRecent = async () => {
        var eventCalls = [{
            "eventName": "getCommunityGoalsRecent",
            "eventTimestamp": new Date().toISOString(),
            "eventData": []
        }]
        const response = await this.#api(eventCalls)
        //console.log("getCommunityGoalsRecent data: ", response)
        var eventsData = []
        if (response.events) response.events.forEach(eventItem => {
            var data = eventItem.eventData.filter(data => (new Date(data.lastUpdate) >= new Date()))
            if (data) eventsData.push(data)
        })
        return eventsData // [[{eventData}]]
    }
}
module.exports = InaraAPI;