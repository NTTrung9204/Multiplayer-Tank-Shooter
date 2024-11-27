const matchDB = require('../models/Match');
class mapRepository{
    createMatch(matchData) {
        return matchDB.create(matchData);
    }

}

module.exports = new mapRepository;