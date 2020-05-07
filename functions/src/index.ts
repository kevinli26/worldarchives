// firebase dependencies
import * as functions from 'firebase-functions' // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as admin from 'firebase-admin' // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp()
const db = admin.firestore() // Reference to our firestore database

// import local files
import * as interfaces from './interfaces'
import * as helpers from './helpers'

// Imports the Google Cloud client library for NLP
import * as language from '@google-cloud/language'
// Creates a client
const client = new language.LanguageServiceClient();

exports.testSentimentAnalysis = functions.https.onRequest(async (req: any, res: any) => {
    const text = 'CHICAGO (WLS) -- There are cases in Chicago of a mysterious illness impacting children that may be connected to COVID-19. The symptoms are very similar to toxic shock syndrome or Kawasaki disease, a rare sickness that involves inflammation of blood vessels.'
    
    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the document
    const [result] = await client.analyzeSentiment({document});

    const sentiment = result.documentSentiment;
    console.log('Document sentiment:');
    console.log(`  Score: ${sentiment.score}`);
    console.log(`  Magnitude: ${sentiment.magnitude}`);

    const sentences = result.sentences;
    sentences.forEach( (sentence: any) => {
        console.log(`Sentence: ${sentence.text.content}`);
        console.log(`  Score: ${sentence.sentiment.score}`);
        console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
    });

    res.end()
})

// implements the functionality of refreshing sources
async function refreshSourcesHelper() {
    try {
        // raw unformatted sources
        const resp: interfaces.rawSource[] = await helpers.getSources();

        // only return english sources in the us
        const formattedResp: string[] = helpers.formatSources(resp);

        // only have one document that keeps track of the sources
        const docRef: any = db.collection('sources').doc('en')

        // upsert into headlines. This will create or overrite the document
        docRef.set({
            sources: formattedResp,
        })
    } catch (error) {
        console.log('failed in refreshSourcesHelper')
        throw error
    }
}

// implements the functionality of refreshing headlines
async function refreshHeadlinesHelper() {
    try {
        // raw unformatted headlines
        const resp: interfaces.rawHeadline[] = await helpers.getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: interfaces.groupedHeadline[] = helpers.formatHeadlines(resp);

        // YYYY-MM-DD document. One per day, updated hourly
        const datetime: string = new Date().toISOString().slice(0,10).toString()

        // reference to the document corresponding to today
        const docRef: any = db.collection('headlines').doc(datetime)

        // upsert into headlines. This will create or overrite the document
        docRef.set({
            ...formattedResp,
        })
    } catch (error) {
        console.error('failed in refreshHeadlinesHelper')
        throw error
    }
}

// manual refresh method for news sources
exports.refreshSources = functions.https.onRequest(async (req: any, res: any) => {
    try {
        await refreshSourcesHelper()
        console.info(`SUCCESS: Manual sources update succeeded`)
        res.end()
    } catch (error) {
        console.error(`FAILURE: Manual sources update failed with error: ${error.toString()}`)
        res.end()
    }
});

// manual refresh method for news headlines
exports.refreshHeadlines = functions.https.onRequest(async (req: any, res: any) => {
    try {
        await refreshHeadlinesHelper()
        console.info(`SUCCESS: Manual headlines update succeeded`)
        res.end()
    } catch (error) {
        console.error(`FAILURE: Manual headlines update failed with error: ${error.toString()}`)
        res.end()
    }
});

// scheduled pubsub job for refreshing news headlines
exports.scheduledDataRefresh = functions.pubsub.schedule('every 60 minutes').onRun( async (context: any) => {
    console.log('Refresh news sources first')
    try {
        await refreshSourcesHelper()
        console.info(`SUCCESS: Scheduled sources update succeeded`)
    } catch (error) {
        console.error(`FAILURE: Scheduled sources update failed with error: ${error.toString()}`)
        return null // exit on error
    }

    console.log('Then refresh headlines')
    try {
        await refreshHeadlinesHelper()
        console.info(`SUCCESS: Scheduled headlines update succeeded`)
    } catch (error) {
        console.error(`FAILURE: Scheduled headlines update failed with error: ${error.toString()}`)
        return null // exit on error
    }

    return null // exit on success
});

// manual refresh method for news headlines, cannot use the helper as the functionality differs
exports.refreshHeadlinesWithDate = functions.https.onRequest(async (req: any, res: any) => {
    try {
        // get passed in date from request
        let documentDate: string = req.query.date;

        // if no date is passed in from the request, use the current day as the parameter
        if (documentDate.length === 0) {
            documentDate = new Date().toISOString().slice(0,10).toString()
        }

        // raw unformatted headlines
        const resp: interfaces.rawHeadline[] = await helpers.getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: interfaces.groupedHeadline[] = helpers.formatHeadlines(resp);

        // reference to the document corresponding to today
        const docRef: any = db.collection('headlines').doc(documentDate)

        // upsert into headlines. This will create or overrite the document
        docRef.set({
            ...formattedResp,
        })

        console.info(`SUCCESS: Manual headlines date update succeeded for ${documentDate}`)
        res.end()
    } catch (error) {
        console.error(`FAILURE: Manual headlines date update failed with error: ${error.toString()}`)
        res.end()
    }
});
