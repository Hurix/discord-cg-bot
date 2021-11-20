'use strict';

const fetch = require('node-fetch');

class InaraAPI {
    INARA_API_URL = "https://inara.cz/inapi/v1/"
    header = {}
    testdata = {}
    constructor(options) {
        this.header = {
            "appName": options.appName,
            "appVersion": options.appVersion,
            "isBeingDeveloped": options.isBeingDeveloped ? true : false,
            "APIkey": options.APIkey
        }
    }
    api = async events => {
        return fetch(this.INARA_API_URL, {
            method: 'post',
            body: JSON.stringify({"header": this.header, "events": events}),
            headers: { "Content-Type": 'application/json' }
        })
        .then(response => response.json())
        .catch (error => {
            console.error('INARA API Error: ', error);
        })
    }
    getCommunityGoalsRecent = async => {
        var now = new Date();
        var events = [{
            "eventName": "getCommunityGoalsRecent",
            "eventTimestamp": now.toISOString(),
            "eventData": []
        }]
        //return this.api(events)
        return this.testdata
    }
}
module.exports = InaraAPI;