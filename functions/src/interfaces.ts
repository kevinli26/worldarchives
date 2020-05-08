/* HEADLINES */
// intermediate interfaces to strictly type the transformation process
export interface Source {
    id: string
    name: string
}

export interface rawHeadline {
    source: Source
    author: string
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
    content: string
}

// the format of the response received from classification content
export interface NLPClassification {
    confidence: number
    name: string
}

// the format of the response received from sentiment analysis
export interface NLPSentiment {
    magnitude: number
    score: number
}

export interface NLPEntity {
    type: string
    salience: number
}

export interface analyzedHeadline {
    source: string
    author: string
    title: string
    description: string
    urlToImage: string
    publishedAt: string
    content: string
    sentiment: NLPSentiment
    classifications: NLPClassification[]
    entities: NLPEntity[]
}

export interface minimizedHeadline {
    author: string
    title: string
    urlToImage: string
    publishedAt: string
    content: string
    sentiment: NLPSentiment
    classifications: NLPClassification[]
    entities: NLPEntity[]
}

// the final form of headlines that the client side will subscribe to
export interface groupedHeadline {
    source: minimizedHeadline[]
}

/* SOURCES */
// intermediate interfaces to strictly type the transformation process
export interface rawSource {
    id: string
    name: string
    description: string
    url: string
    category: string
    language: string
    country: string
}