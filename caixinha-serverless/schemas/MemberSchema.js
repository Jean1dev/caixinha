const Mongoose = require('mongoose')

const MemberSchema = new Mongoose.Schema({
    memberName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    collection: 'members'
})

module.exports =  Mongoose.model('MemberSchema', MemberSchema)