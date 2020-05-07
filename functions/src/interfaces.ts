/* HEADLINES */
// intermediate interfaces to strictly type the transformation process
export interface Source {
    id: string;
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

export interface analyzedHeadline {
    source: string
    author: string
    title: string
    description: string
    urlToImage: string
    publishedAt: string
    content: string
    sentimentScore: number
    sentimentMagnitude: number
}

export interface minimizedHeadline {
    author: string
    title: string
    urlToImage: string
    publishedAt: string
    content: string
    sentimentScore: number
    sentimentMagnitude: number
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