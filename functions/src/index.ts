// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const axios = require('axios').default
//TO-DO: move to environment variables
const newsCredentials = '3f5ecb41c72d4ea5a059d84cc87988b9'

interface Source {
    id: string;
    name: string
}

interface rawHeadline {
    source: Source;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

interface formattedHeadline {
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}


async function getHeadlines() {
    try {
        const raw: any = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsCredentials}`)
        const response: any = raw.data
        if (response.status !== 'ok') {
            throw new Error("Error. Unexepcted response status")
        } else {
            return response.articles
        }
    } catch (error) {
        return error
    }
}

function formatHeadlines(headlines: rawHeadline[]): formattedHeadline[] {
    const formatted: formattedHeadline[] = headlines.map(headline => {
        return {
            ...headline,
            source: headline.source.name, // format source to get string description
        }
    })
    return formatted
}

exports.addMessage = functions.https.onRequest(async (req: any, res: any) => {
  const resp: rawHeadline[] = await getHeadlines();
  const formattedResp: formattedHeadline[] = formatHeadlines(resp);

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref('/messages').push({headlines: formattedResp});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});
