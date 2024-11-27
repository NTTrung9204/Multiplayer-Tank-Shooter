class HistoryController {
    index(req, res) {
        if(req.session.user_id){
            res.render('history',{username:req.session.username});
        }
    }
}

module.exports = new HistoryController