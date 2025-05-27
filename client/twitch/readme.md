# Cree un chatbot privé et recuperer son Client ID et son Client Secret sur https://dev.twitch.tv/console/apps

# Rentrer l'url suivante avec son clientId et le meme URL de redirection OAuth que ke chatbot dans son navigateur pour obtenir un code d'autorisation :
https://id.twitch.tv/oauth2/authorize?client_id=MY_CLIENT_ID&redirect_uri=MY_REDIRECT_URI&response_type=code&scope=chat:read+chat:edit

# Rentrez le code d'autorisation obtenu dans la requete suivante ainsi que son clientId et de sa cle secrete pour obtenir un access token :
curl -X POST "https://id.twitch.tv/oauth2/token?client_id=MY_CLIENT_ID&client_secret=MY_CLIENT_SECRET&code=MY_CODE&grant_type=authorization_code&redirect_uri=MY_REDIRECT_URI"

exemple : {"access_token":"**MY_ACCESS_TOKEN**","expires_in":13876,"refresh_token":"**MY_REFRESH_TOKEN**","scope":["chat:edit","chat:read"],"token_type":"bearer"}
