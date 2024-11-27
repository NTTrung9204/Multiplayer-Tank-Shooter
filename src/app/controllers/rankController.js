class rankController {
    async index(req, res) {
        const page = parseInt(req.params.page) || 1;

        const { sortedUsers, totalCount, totalPages, limit, paginationLoop } = await rankService.findRank(page);
        res.render('rank/rank', {
            sortedUsers,
            totalCount,
            totalPages,
            currentPage: page,
            limit,
            paginationLoop
        });
    }
}

module.exports = new rankController