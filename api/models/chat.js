const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    room: { type: Number, required: true, },
    name: { type: String, required: true, },
    id: { type: String, required: true, },
    content: { type: String },
    type: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    })

chatSchema.statics.create = function(payload) {
    const chat = new this(payload)

    return chat.save()
}

chatSchema.statics.findsByRoomNo = function(roomNo) {
    return this.find({room: roomNo}, { _id: false, id: true, name: true, content: true, type: true, }).sort({_id: -1}).limit(50).then(result => result.reverse());
}

module.exports = mongoose.model('Chat', chatSchema)