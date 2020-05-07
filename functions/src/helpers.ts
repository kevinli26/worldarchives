// firebase dependencies
import * as functions from 'firebase-functions' // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

// external dependencies
const axios = require('axios').default
axios.defaults.headers.get['X-Api-Key'] = functions.config().newsapi.key // set api key in header for all for all GET requests
const language = require('@google-cloud/language') // Imports the Google Cloud client library for NLP
const client = new language.LanguageServiceClient() // activates the client to provide an interface

// import local files
import * as interfaces from './interfaces'



// implements the functionality of the NLP sentiment analysis
async function sentimentAnalysis(text: string) {
    // prepare a document to analyze
    const document = {
       content: text,
       type: 'PLAIN_TEXT',
    }

   // Analyzes and stores the sentiment of the document
   const [result] = await client.analyzeSentiment({document})

   const sentiment: any = result.documentSentiment
//    console.log(`Sentiment Score: ${sentiment.score}`)
//    console.log(`Sentiment Magnitude: ${sentiment.magnitude}`)

   return sentiment
}


// groupHeadlines is a helper function to group arrays by a provided key
export function groupHeadlines(ungrouped: interfaces.analyzedHeadline[], key: string): interfaces.groupedHeadline[] {
    return ungrouped.reduce((grouped: any, each: any) => {
        (grouped[each[key]] = grouped[each[key]] || []).push({
            author: each.author || 'Anonymous', // if author is null, set as anonymous
            title: each.title,
            urlToImage: each.urlToImage,
            publishedAt: each.publishedAt,
            content: each.content || each.description || "Not Available",
            sentimentScore: each.sentimentScore,
            sentimentMagnitude: each.sentimentMagnitude,
        });
        return grouped;
    }, {});
};

// getSources gets the list of sources
export async function getSources() {
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
        console.error('Failed in getSources')
        throw error
    }
}

// getHeadlines gets the raw news data
export async function getHeadlines() {
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
        console.error('Failed in getHeadlines')
        throw error
    }
}

// analyze headlines filters and aggregates rawData into a storeable format, then runs NLP apis on it
export async function analyzeHeadlines(headlines: interfaces.rawHeadline[]) {
    const formatted: interfaces.analyzedHeadline[] = await Promise.all(headlines.map(async headline => {
        const sentimentResult: any = await sentimentAnalysis(headline.content)
        return {
            source: headline.source.name, // format source to get string description
            author: headline.author,
            title: headline.title,
            description: headline.description, // to be used for content if it is unavailable
            urlToImage: headline.urlToImage,
            publishedAt: headline.publishedAt,
            content: headline.content,
            sentimentScore: sentimentResult.score,
            sentimentMagnitude: sentimentResult.magnitude,
        }
    }))
    return formatted
}

// formatSources filters sources and based on language and country
export function formatSources(sources: interfaces.rawSource[]): string[]{
    const sourcesOnly: string[] = sources.map(source => {
        return source.name
    })
    return sourcesOnly
}