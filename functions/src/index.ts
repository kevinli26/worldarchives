// firebase dependencies
const functions = require('firebase-functions') // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const admin = require('firebase-admin') // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp()
const db = admin.firestore() // Reference to our firestore database

// external dependencies
const axios = require('axios').default
axios.defaults.headers.get['X-Api-Key'] = functions.config().newsapi.key // set api key in header for all for all GET requests

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
    description: string
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

interface rawSource {
    id: string
    name: string
    description: string
    url: string
    category: string
    language: string
    country: string
}

// groupHeadlines is a helper function to group arrays by a provided key
function groupHeadlines(ungrouped: formattedHeadline[], key: string) {
    return ungrouped.reduce((grouped: any, each: any) => {
        (grouped[each[key]] = grouped[each[key]] || []).push({
            author: each.author || 'Anonymous', // if author is null, set as anonymous
            title: each.title,
            urlToImage: each.urlToImage,
            publishedAt: each.publishedAt,
            content: each.content || each.description || "Not Available",
        });
        return grouped;
    }, {});
};

// getSources gets the list of sources
async function getSources() {
    try {
        const raw: any = await axios.get('https://newsapi.org/v2/sources', {
            params: {
                language: 'en',
                country: 'us',
            }
        })
        const response: any = raw.data
        if (response.status !== 'ok') {
            throw new Error("Error. Unexepcted response status when fetching sources")
        } else {
            return response.sources
        }
    } catch (error) {
        console.log('Failed in getSources')
        throw error
    }
}

// getHeadlines gets the raw news data
async function getHeadlines() {
    try {
        const raw: any = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: 'us',
            }
        })
        const response: any = raw.data
        if (response.status !== 'ok') {
            throw new Error("Error. Unexepcted response status when fetching headlines")
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
            description: headline.description, // to be used for content if it is unavailable
            urlToImage: headline.urlToImage,
            publishedAt: headline.publishedAt,
            content: headline.content,
        }
    })

    // group headlines by source
    const grouped: groupedHeadline[] = groupHeadlines(formatted, 'source')
    
    return grouped
}

// formatSources filters sources and based on language and country
function formatSources(sources: rawSource[]): string[]{
    const sourcesOnly: string[] = sources.map(source => {
        return source.name
    })
    return sourcesOnly
}

// manual refresh method for news sources
exports.getSources = functions.https.onRequest(async (req: any, res: any) => {
    try {
        // raw unformatted sources
        const resp: rawSource[] = await getSources();

        // only return english sources in the us
        const formattedResp: string[] = formatSources(resp);

        // only have one document that keeps track of the sources
        const docRef: any = db.collection('sources').doc('en')

        // upsert into headlines. This will create or overrite the document
        docRef.set({
            sources: formattedResp,
        })

        console.log(`SUCCESS: Manual sources update succeeded`)
        res.end()
    } catch (error) {
        console.log(`FAILURE: Manual sources update failed with error: ${error.toString()}`)
    }
});


// manual refresh method for news headlines
exports.getHeadlines = functions.https.onRequest(async (req: any, res: any) => {
    try {
        // raw unformatted headlines
        const resp: rawHeadline[] = await getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: groupedHeadline[] = formatHeadlines(resp);

        // YYYY-MM-DD document. One per day, updated hourly
        const datetime: string = new Date().toISOString().slice(0,10).toString()

        // reference to the document corresponding to today
        const docRef: any = db.collection('headlines').doc(datetime)

        // upsert into headlines. This will create or overrite the document
        docRef.set({
            ...formattedResp,
        })

        console.log(`SUCCESS: Manual headlines update succeeded for ${datetime}`)
        res.end()
    } catch (error) {
        console.log(`FAILURE: Manual headlines update failed with error: ${error.toString()}`)
    }
});

// scheduled pubsub job for refreshing news headlines
exports.scheduledDataRefresh = functions.pubsub.schedule('every 60 minutes').onRun( async (context: any) => {
    console.log('Refresh news sources first')
    try {
        // raw unformatted sources
        const resp: rawSource[] = await getSources();

        // only return english sources in the us
        const formattedResp: string[] = formatSources(resp);

        // only have one document that keeps track of the sources
        const docRef: any = db.collection('sources').doc('en')

        // upsert into headlines. This will create or overrite the document
        docRef.set({
            sources: formattedResp,
        })

        console.log(`SUCCESS: Scheduled sources update succeeded`)
    } catch (error) {
        console.log(`FAILURE: Scheduled sources update failed with error: ${error.toString()}`)
        return null // exit on error
    }

    console.log('Then refresh headlines')
    try {
        // raw unformatted headlines
        const resp: rawHeadline[] = await getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: groupedHeadline[] = formatHeadlines(resp);

        // YYYY-MM-DD document. One per day, updated hourly
        const datetime: string = new Date().toISOString().slice(0,10).toString()

        // reference to the document corresponding to today
        const docRef: any = db.collection('headlines').doc(datetime)

        // upsert into headlines. This will create or overrite the document
        docRef.set({
            ...formattedResp,
        })

        console.log(`SUCCESS: Scheduled headlines update succeeded for ${datetime}`)
    } catch (error) {
        console.log(`FAILURE: Scheduled headlines update failed with error: ${error.toString()}`)
        return null // exit on error
    }

    return null // exit on success
});

// manual refresh method for news headlines
exports.getHeadlinesDate = functions.https.onRequest(async (req: any, res: any) => {
    try {
        // get passed in date from request
        let documentDate: string = req.query.date;

        // if no date is passed in from the request, use the current day as the parameter
        if (documentDate.length === 0) {
            documentDate = new Date().toISOString().slice(0,10).toString()
        }

        // raw unformatted headlines
        const resp: rawHeadline[] = await getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: groupedHeadline[] = formatHeadlines(resp);

        // reference to the document corresponding to today
        const docRef: any = db.collection('headlines').doc(documentDate)

        // upsert into headlines. This will create or overrite the document
        docRef.set({
            ...formattedResp,
        })

        console.log(`SUCCESS: Manual headlines date update succeeded for ${documentDate}`)
        res.end()
    } catch (error) {
        console.log(`FAILURE: Manual headlines date update failed with error: ${error.toString()}`)
    }
});