const mapDB = require('../models/Map');

class mapRepository {
    findAllMapsNotDisabled() {
        return mapDB.find({disabled: false});
    }

    createMap(mapData) {
        return mapDB.create(mapData);
    }

    findMapById(id) {
        return mapDB.findById(id);
    }

    disabledMapById(id) {
        return mapDB.findByIdAndUpdate(id, {disabled: true});
    }
}

module.exports = new mapRepository;