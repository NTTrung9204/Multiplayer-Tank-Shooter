class chatController{
    index(req, res){
        const user_id = req.session.user_id;
        res.render('chatCommunity/chat', {user_id}); 
    }
}

module.exports = new chatController;