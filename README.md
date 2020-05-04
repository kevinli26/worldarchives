Pub-sub service that allows users to subscribe to archived headlines from various news sources.

Project structure:
- Scheduled cloud functions with Firebase
- Realtime database that is updated every 30-60 minutes by the cloud function
- Frontend react app that subscribes to this realtime database, and displays data based on user choices

Future ideas:
- Implement auth from scratch using Passport.js (will require backend) OR use Google OAuth
- Add server to run ML apis on news data before updating (can add to firebase)
- Deploy with Heroku
