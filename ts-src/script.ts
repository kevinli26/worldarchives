const axios = require('axios').default
const newsCredentials = '3f5ecb41c72d4ea5a059d84cc87988b9'

interface Source {
    id: string;
    name: string
}

interface rawHeadline {
    source: Source;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

interface formattedHeadline {
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}


async function getHeadlines() {
    try {
        const raw: any = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsCredentials}`)
        const response: any = raw.data
        if (response.status !== 'ok') {
            throw "Error. Unexepcted response status"
        } else {
            return response.articles
        }
    } catch (error) {
        return error
    }
}

function formatHeadlines(headlines: rawHeadline[]): formattedHeadline[] {
    const formatted: formattedHeadline[] = headlines.map(headline => {
        return {
            ...headline,
            source: headline.source.name, // format source to get string description
        }
    })
    return formatted
}

// entry point of program
(async function main() {
    const resp: rawHeadline[] = await getHeadlines();
    const formattedResp: formattedHeadline[] = formatHeadlines(resp)

    console.log(formattedResp);
})();