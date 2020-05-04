const functions = require('firebase-functions') // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const admin = require('firebase-admin') // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp()
const db = admin.firestore() // Reference to our firestore database
const axios = require('axios').default
const newsCredentials = '3f5ecb41c72d4ea5a059d84cc87988b9' //TO-DO: move to environment variables

// interfaces to strictly type data transformation process
interface Source {
    id: string;
    name: string
}

interface rawHeadline {
    source: Source
    author: string
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
    content: string
}

interface formattedHeadline {
    source: string
    author: string
    title: string
    urlToImage: string
    publishedAt: string
    content: string
}

interface minimizedHeadline {
    author: string
    title: string
    urlToImage: string
    publishedAt: string
    content: string
}

// the final form that the client side will subscribe to
interface groupedHeadline {
    source: minimizedHeadline[]
}

// groupBy is a helper function to group arrays by a provided key
function groupBy(ungrouped: any[], key: string) {
    return ungrouped.reduce((grouped: any, each: any) => {
        (grouped[each[key]] = grouped[each[key]] || []).push({
            author: each.author || 'Anonymous', // if author is null, set as anonymous
            title: each.title,
            urlToImage: each.urlToImage,
            publishedAt: each.publishedAt,
            content: each.content,
        });
        return grouped;
    }, {});
};

// getHeadlines gets raw data from news api
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

// formatHeadlines filters and aggregates rawData into a storeable format
function formatHeadlines(headlines: rawHeadline[]): groupedHeadline[] {
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

    // group data by source
    const grouped: groupedHeadline[] = groupBy(formatted, 'source')
    
    return grouped
}

// TO-DO: make this into a scheduled pubsub function
exports.getHeadlines = functions.https.onRequest(async (req: any, res: any) => {
    try {
        // raw unformatted headlines
        const resp: rawHeadline[] = await getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: groupedHeadline[] = formatHeadlines(resp);

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
