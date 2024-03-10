let mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    user1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    user2:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    messages: [{
        body: String,
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    }],
});


module.exports = mongoose.model('Chat', ChatSchema);