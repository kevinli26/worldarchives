Pub-sub based service that allows users to subscribe to news archives from a multitude of sources

Project diagram:
![](images/Architecture.jpg)

Project structure:
- Scheduled pub/sub cloud functions with Firebase that saves the latest headlines every hour into Firestore
- Client side react SPA that subscribes to headlines from custom date ranges and news sources. Listens to DB changes in realtime, updating the client view on any new headlines
- Local session-based caching to save authentication state
- Integrated NLP through GCP. Seamless support and transformation of sentiment analysis, entity analysis, and content classification data
- OAuth and Guest login in with Firebase

Future ideas:
- Implement auth from scratch using Passport.js
- Dockerize and deploy on AWS or GCP
- Save user preferences and account info to provide a customized experience
- Add email-based subscription service to email weekly/monthly summaries with Sendgrid


To start the application, in the client folder, run:
1. npm install
2. npm start
3. Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
