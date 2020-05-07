// firebase dependencies
import * as functions from 'firebase-functions' // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as implementation from './implementation'

// manual refresh method for news sources
exports.refreshSources = functions.https.onRequest(async (req: any, res: any) => {
    try {
        await implementation.refreshSourcesHelper()
        console.info(`SUCCESS: Manual sources update succeeded`)
        res.end()
    } catch (error) {
        console.error(`FAILURE: Manual sources update failed with error: ${error.toString()}`)
        res.end()
    }
})

// manual refresh method for news headlines
exports.refreshHeadlines = functions.https.onRequest(async (req: any, res: any) => {
    try {
        await implementation.refreshHeadlinesHelper()
        console.info(`SUCCESS: Manual headlines update succeeded`)
        res.end()
    } catch (error) {
        console.error(`FAILURE: Manual headlines update failed with error: ${error.toString()}`)
        res.end()
    }
})

// scheduled pubsub job for refreshing news headlines
// 5000 requests per month = 160 request per day =  6 requests per hour
exports.scheduledDataRefresh = functions.pubsub.schedule('every 6 hours').onRun( async (context: any) => {
    console.log('Refresh news sources first')
    try {
        await implementation.refreshSourcesHelper()
        console.info(`SUCCESS: Scheduled sources update succeeded`)
    } catch (error) {
        console.error(`FAILURE: Scheduled sources update failed with error: ${error.toString()}`)
        return null // exit on error
    }

    console.log('Then refresh headlines')
    try {
        await implementation.refreshHeadlinesHelper()
        console.info(`SUCCESS: Scheduled headlines update succeeded`)
    } catch (error) {
        console.error(`FAILURE: Scheduled headlines update failed with error: ${error.toString()}`)
        return null // exit on error
    }

    return null // exit on success of both sources and headlines refresh
})

// manual refresh method for news headlines, cannot use the helper as the functionality differs
exports.refreshHeadlinesWithDate = functions.https.onRequest(async (req: any, res: any) => {
    try {
        // get passed in date from request
        const documentDate: string = req.query.date

        // refresh headlines for the provided date
        await implementation.refreshHeadlinesHelper(documentDate)
        console.info(`SUCCESS: Manual headlines date update succeeded`)

        res.end()
    } catch (error) {
        console.error(`FAILURE: Manual headlines date update failed with error: ${error.toString()}`)
        res.end()
    }
})
