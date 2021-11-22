ED CG-Viewer for Discord
=
A Discord Webhook to jail into a channel and show current Elite: Dangerous Community Goal information, fetched from the INARA.cz API endpoint.

Update cycle is 60 minutes.

Disclaimer: Information shown may be inaccurate, since it is depending on 3rd Party Tools input provided by volunteering players only and the INARA.cz APIs availability and update timings.



Developer Info
-
Install Node.js v16.6+ and other dependencies:
> npm install discord.js node-fetch@cjs

Update API Tokens:

Edit `auth.json_example` with your API Tokens and save as `auth.json`

Run:
> node .