// firebase dependencies
import * as admin from 'firebase-admin' // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp()
const db = admin.firestore() // Reference to our firestore database

// import local files
import * as interfaces from './interfaces'
import * as helpers from './helpers'

// Imports the Google Cloud client library
const language = require('@google-cloud/language')
const client = new language.LanguageServiceClient()

// implements the functionality of the NLP sentiment analysis
export async function sentimentAnalysis(text: string) {
    // Prepares a document, representing the provided text
    const document = {
       content: text,
       type: 'PLAIN_TEXT',
   };

   // Detects the sentiment of the document
   const [result] = await client.analyzeSentiment({document})

   const sentiment: any = result.documentSentiment
   console.log('Document sentiment:')
   console.log(`  Score: ${sentiment.score}`)
   console.log(`  Magnitude: ${sentiment.magnitude}`)

   const sentences = result.sentences
   sentences.forEach( (sentence: any) => {
       console.log(`Sentence: ${sentence.text.content}`)
       console.log(`  Score: ${sentence.sentiment.score}`)
       console.log(`  Magnitude: ${sentence.sentiment.magnitude}`)
   })

   return sentiment
}

// implements the functionality of refreshing sources
export async function refreshSourcesHelper() {
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
        console.error('failed in refreshSourcesHelper')
        throw error
    }

    return
}

// implements the functionality of refreshing headlines
// providing a date is an optional parameter
export async function refreshHeadlinesHelper(date?: string) {
    try {
        // raw unformatted headlines
        const resp: interfaces.rawHeadline[] = await helpers.getHeadlines();

        // minimized and aggregated headlines, grouped by source
        const formattedResp: interfaces.groupedHeadline[] = helpers.formatHeadlines(resp);

        let datetime: string
        // if date is not provided, then it is an hourly scheduled refresh
        if (date === undefined) {
            // YYYY-MM-DD document. One per day, updated hourly
            datetime = new Date().toISOString().slice(0,10).toString()
        } else {
            // use the provided date to backfill headlines for previous dates
            datetime = date
        }

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

    return
}