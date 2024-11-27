const matchRepository=require("../../repositories/matchRepository");

class matchService{
    async createMatch(matchData) {
        return await matchRepository.createMatch(matchData);
    }
}

module.exports=new matchService;