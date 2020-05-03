"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require('axios').default;
const newsCredentials = '3f5ecb41c72d4ea5a059d84cc87988b9';
function getHeadlines() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const raw = yield axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsCredentials}`);
            const response = raw.data;
            if (response.status !== 'ok') {
                throw "Error. Unexepcted response status";
            }
            else {
                return response.articles;
            }
        }
        catch (error) {
            return error;
        }
    });
}
function formatHeadlines(headlines) {
    const formatted = headlines.map(headline => {
        return Object.assign(Object.assign({}, headline), { source: headline.source.name });
    });
    return formatted;
}
// entry point of program
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield getHeadlines();
        const formattedResp = formatHeadlines(resp);
        console.log(formattedResp);
    });
})();
