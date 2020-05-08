// firebase dependencies
import * as functions from 'firebase-functions' // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const language = require('@google-cloud/language') // Imports the Google Cloud client library
const client = new language.LanguageServiceClient()

// external dependencies
const axios = require('axios').default
axios.defaults.headers.get['X-Api-Key'] = functions.config().newsapi.key // set api key in header for all for all GET requests

// import local files
import * as interfaces from './interfaces'

// implements the sentiment analysis of headline content
export async function analyzeSentiment(text: string) {
    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    }
    
    // Analyze the sentiment of the document and store the result
    const [result] = await client.analyzeSentiment({document})
    
    const sentiment: interfaces.NLPSentiment = result.documentSentiment  
    return sentiment
}

// implements the content classification of headline content
export async function classifyContent(text: string) {
    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    }
    
    // Classify the content of the document and store the result
    const [classification] = await client.classifyText({document})
    
    const categories: interfaces.NLPClassification[] = classification.categories
    return categories
}

// implements the entity anlyzation of headline content
export async function analyzeEntity(text: string) {
    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    }
    
    // Detect the entities of the document and store the result
    const [result] = await client.analyzeEntities({document})
    
    // map the results to transform it into the desired shape first
    let entities: interfaces.NLPEntity[] = result.entities.map((entity: any) => {
        return {
            type: entity.type,
            salience: entity.salience,
        }
    })

    // finally, filter out undetermined values and those with 0 salience
    entities = entities.filter((entity: interfaces.NLPEntity) => {
        if (entity.salience === 0 || entity.type === 'OTHER' || entity.type === 'UNKNOWN') {
            return false
        }
        return true
    })
    return entities
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
            sentiment: each.sentiment,
            classifications: each.classifications,
            entities: each.entities,
        })
        return grouped
    }, {})
}

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
        // lazy variables to store the content of the NLP api response (or mocked data if the content is null)
        let sentimentResult: interfaces.NLPSentiment
        let classificationResults: interfaces.NLPClassification[]
        let entityResults: interfaces.NLPEntity[]

        // don't call NLP api if we have null content, instead provided mocked results to represent null results
        if (headline.content === null || headline.content.length === 0) {
            sentimentResult = {
                score: 0,
                magnitude: 0,
            }
            classificationResults = []
            entityResults = []
        } else {
            sentimentResult = await analyzeSentiment(headline.content)
            classificationResults = await classifyContent(headline.content)
            entityResults = await analyzeEntity(headline.content)
        } 
        
        return {
            source: headline.source.name, // format source to get string description
            author: headline.author,
            title: headline.title,
            description: headline.description, // to be used for content if it is unavailable
            urlToImage: headline.urlToImage,
            publishedAt: headline.publishedAt,
            content: headline.content,
            sentiment: sentimentResult,
            classifications: classificationResults,
            entities: entityResults,
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