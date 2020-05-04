// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
// Reference to our firestore database
const db = admin.firestore();

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
        console.log('Failed in getHeadlines')
        throw error
    }
}

function formatHeadlines(headlines: rawHeadline[]): formattedHeadline[] {
    const formatted: formattedHeadline[] = headlines.map(headline => {
        return {
            source: headline.source.name, // format source to get string description
            author: headline.author,
            title: headline.title,
            urlToImage: headline.urlToImage,
            publishedAt: headline.publishedAt,
            content: headline.content,
        }
    })
    // TO-DO: group by sources
    return formatted
}

// TO-DO: make this into a scheduled pubsub function
exports.getHeadlines = functions.https.onRequest(async (req: any, res: any) => {
    try {
        // raw unformatted headlines
        const resp: rawHeadline[] = await getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: formattedHeadline[] = formatHeadlines(resp);

        // YYYY-MM-DD document. One per day, updated hourly
        const datetime: string = new Date().toISOString().slice(0,10).toString()

        // upsert into headlines
        const docRef: any = db.collection('headlines').doc(datetime)
        docRef.set({
            ...formattedResp,
        })
        console.log(`SUCCESS: upserted records for ${datetime}`)
    
        // TO-DO: remove dummy direction when integrated into pubsub
        res.redirect('https://www.google.com/')
    } catch (error) {
        console.log(`FAILURE: ${error.toString()}`)
    }
});
