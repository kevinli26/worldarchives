// firebase dependencies
import * as functions from 'firebase-functions' // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as admin from 'firebase-admin' // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp()
const db = admin.firestore() // Reference to our firestore database

// import local files
import * as interfaces from './interfaces'
import * as helpers from './helpers'

// manual refresh method for news sources
exports.getSources = functions.https.onRequest(async (req: any, res: any) => {
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
        const resp: interfaces.rawSource[] = await helpers.getSources();

        // only return english sources in the us
        const formattedResp: string[] = helpers.formatSources(resp);

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
        const resp: interfaces.rawHeadline[] = await helpers.getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: interfaces.groupedHeadline[] = helpers.formatHeadlines(resp);

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
