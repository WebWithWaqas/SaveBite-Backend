const express = require('express');
const { authorize, ADMIN } = require('../../middlewares/auth');

const router = express.Router();

let Chat = require('../../models/Chat');

router.post('/', authorize(), (req, res, next) => {

    //check if chat already exists
    Chat.findOne({
        $or: [
            {
                user1: req.user._id,
                user2: req.body.user1
            },
            {
                user1: req.body.user1,
                user2: req.user._id
            }
        ]
    }).then(chat => {
        if(chat){
            res.json({message: 'Chat already exists', chat});
        }

        else{
            let chat = new Chat({
                user1: req.body.user1,
                user2: req.user._id,
            });
        
            chat.save((err, chat) => {
                if (err) {
                    return next(err);
                }
                res.status(201).json({
                    message: 'Chat created successfully',
                    chat,
                });
            })
        }
    }).catch(err => {})

});

router.get('/get/all', authorize(), (req, res, next) => {
    Chat.find({$or: [{user1: req.user._id}, {user2: req.user._id}]}).populate("user1").populate("user2").exec((err, chats) => {
        res.json(chats);
    });
})

router.post('/message/:id', authorize(), (req, res, next) => {
    Chat.findById(req.params.id, (err, chat) => {
        chat.messages.push({
            body: req.body.message,
            by: req.user._id,
        });

        chat.save((err, chat) => {
            res.json(chat);
        });
    });
})




router.get('/message/:id', authorize(), (req, res, next) => {

    Chat.findById(req.params.id, (err, chatRes) => {
        res.json(chatRes);
    });
})

router.post('/delete/:id', authorize(), (req, res, next) => {
    console.log(req.params.id)
    Chat.findOneAndRemove({ _id: req.params.id}, (err, chatRes) => {
        console.log('res',chatRes)
        res.json(chatRes);
    });
})


module.exports = router;
