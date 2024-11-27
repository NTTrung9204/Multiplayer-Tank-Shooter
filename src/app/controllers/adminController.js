class adminController {
    // [GET] /admin
    index(req, res) {
        res.render("admin/admin");
    }

    // [GET] /admin/map
    async map(req, res) {
        const myMaps = await mapService.getAllMapsNotDisabled();
        if (!myMaps || myMaps.length === 0) {
            return res.status(404).send("No maps found");
        }
        res.render("admin/map", { myMaps });
    }

    // [GET] /admin/map/create
    createLayout(req, res) {
        res.render("admin/createLayout");
    }
    
    // [POST] /admin/map/create
    async createMap(req, res) {
        const mapData = JSON.parse(req.body.mapData);
        const newMap = await mapService.createMap(mapData);
        if (!newMap) {
            return res.status(500).send("Error creating map");
        }
        res.redirect("/admin/map");
    }

    // [GET] /admin/map/edit/:id
    async editLayout(req, res) {
        const id = req.params.id;
        const map = await mapService.getMapById(id);
        if (!map) {
            return res.status(404).send("Map not found");
        }
        res.render("admin/editLayout", { map });
    }

    // [POST] /admin/map/edit/:id
    async editMap(req, res) {
        const mapData = JSON.parse(req.body.mapData);
        const id = req.params.id;
        const newMap = await mapService.createMap(mapData);
        if (!newMap) {
            return res.status(500).send("Error creating map");
        }
        const disabledMap = await mapService.disabledMapById(id);
        if (!disabledMap) {
            return res.status(500).send("Error disabling map");
        }
        res.redirect("/admin/map");
    }
}

module.exports = new adminController();
