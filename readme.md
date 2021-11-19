Discord CG-Bot
=
A Discord Bot to jail into a channel and show current Elite: Dangerous Community Goal information, fetched from the INARA.cz API endpoint.

Update cycle is 15 minutes.

Disclaimer: Information shown may be inaccurate, since it is depending on 3rd Party Tools input provided by volunteering players only.



Developer Info
-
Install Node.js and Dependencies:
> npm install discord.io winston -save
> npm install node-fetch

Update API Tokens:

Edit `auth.json_example` with your Discord and INARA API Tokens and save as `auth.json`

Run:
> node bot.js