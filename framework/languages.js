let languages = {
    languagesDataset: require('../languages'),
    /**
     * ### Get text from language
     * @param {string} language Language name
     * @param {string} id Text identifier
     * @returns {string} Text from language with provided identifier
     */
    get: (language, id) => {
        if(!language||!id||!languages.languagesDataset[language]||!languages.languagesDataset[language][id]) return false;
        return languages.languagesDataset[language][id];
    },
    /**
     * ### Refresh languages config
     */
    refresh: () => {
        languages.languagesDataset = require('../languages');
    }
}
module.exports = languages;