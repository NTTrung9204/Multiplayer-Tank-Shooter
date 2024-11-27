class mapService {
    async getAllMapsNotDisabled() {
        const mapQuery = await mapRepository.findAllMapsNotDisabled();
        if (mapQuery.length === 0) {
            return null;
        }
        
        return myUtils.getListRecordMongoDB(mapQuery);
    }

    async createMap(mapData) {
        return await mapRepository.createMap(mapData);
    }

    async getMapById(id) {
        const mapQuery = await mapRepository.findMapById(id);
        if (!mapQuery) {
            return null;
        }
        return myUtils.getRecordMongoDB(mapQuery);
    }

    async disabledMapById(id) {
        return await mapRepository.disabledMapById(id);
    }
}

module.exports = new mapService;