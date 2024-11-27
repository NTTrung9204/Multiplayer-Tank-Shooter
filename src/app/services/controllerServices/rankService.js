class rankService{
    async findRank(page){
        var sortedUsers = await userRepository.findRank(page, limit);
        sortedUsers = myUtils.getListRecordMongoDB(sortedUsers);

        for(let i = 0; i < sortedUsers.length; i++){
            sortedUsers[i].rank = i + 1 + (page - 1) * limit;
            sortedUsers[i].quantityMatch = sortedUsers[i].history_match.length || 0;
        }

        const totalCount = await userRepository.countDocuments();

        const totalPages = Math.ceil(totalCount / limit);

        const paginationLoop = [];
        for (let i = 1; i <= totalPages; i++) {
            paginationLoop.push(i);
        }

        return {
            sortedUsers,
            totalCount,
            totalPages,
            limit,
            paginationLoop
        };
    }
}

module.exports = new rankService;