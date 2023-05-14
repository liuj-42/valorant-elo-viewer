# valorant-elo-viewer
 Valorant ELO Viewer and Tracker hosted on a Node.js Web Server using Express


GET /
	- Track the last 5 comp games win/losses for a user on request

GET /track 
	- Running Data Collection on a 15 minute timer

GET /visualize
	- Visualize up to 4 players data at the same time 