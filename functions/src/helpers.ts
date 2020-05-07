// firebase dependencies
import * as functions from 'firebase-functions' // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.

// external dependencies
const axios = require('axios').default
axios.defaults.headers.get['X-Api-Key'] = functions.config().newsapi.key // set api key in header for all for all GET requests

// import local files
import * as interfaces from './interfaces'

// groupHeadlines is a helper function to group arrays by a provided key
export function groupHeadlines(ungrouped: interfaces.formattedHeadline[], key: string) {
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

// formatHeadlines filters and aggregates rawData into a storeable format
export function formatHeadlines(headlines: interfaces.rawHeadline[]): interfaces.groupedHeadline[] {
    const formatted: interfaces.formattedHeadline[] = headlines.map(headline => {
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
    const grouped: interfaces.groupedHeadline[] = groupHeadlines(formatted, 'source')
    
    return grouped
}

// formatSources filters sources and based on language and country
export function formatSources(sources: interfaces.rawSource[]): string[]{
    const sourcesOnly: string[] = sources.map(source => {
        return source.name
    })
    return sourcesOnly
}