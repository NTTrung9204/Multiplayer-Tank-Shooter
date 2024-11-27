const matchDB = require('../models/Match')

class replayController {
    index(req, res) {
        matchDB.aggregate([
            {
                $lookup: {
                    from: 'maps',
                    localField: 'map_id',
                    foreignField: '_id',
                    as: 'map_infor'
                }
            }
        ])
            .then((matches) => {
                matches = matches[matches.length - 1]
                res.render('replay/replay', { matches })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

module.exports = new replayController