class settingApi{
    // [PUT] /api/user/saveMovementMode
    async saveSetting(req, res) {
        const result = await apiServices.saveMovementMode(req);
        res.send( result );
    }
}

module.exports = new settingApi;