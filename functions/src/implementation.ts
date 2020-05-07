// firebase dependencies
import * as admin from 'firebase-admin' // The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp()
const db = admin.firestore() // Reference to our firestore database

// import local files
import * as interfaces from './interfaces'
import * as helpers from './helpers'

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
        const resp: interfaces.rawHeadline[] = await helpers.getHeadlines()

        // minimized headlines with applied NLP
        const formattedResp: interfaces.analyzedHeadline[] = helpers.analyzeHeadlines(resp)

        // group headlines by source
        const grouped: interfaces.groupedHeadline[] = helpers.groupHeadlines(formattedResp, 'source')

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
            ...grouped,
        })

        console.info(`refreshed headlines for ${datetime}`)
    } catch (error) {
        console.error('failed in refreshHeadlinesHelper')
        throw error
    }

    return
}