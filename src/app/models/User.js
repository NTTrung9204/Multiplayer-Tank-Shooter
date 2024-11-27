const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, unique: true, maxLength: 600 },
    password: { type: String, maxLength: 600 },
    firstname: { type: String, maxLength: 20 },
    lastname: { type: String, maxLength: 20 },
    email: { type: String, maxLength: 600 },
    created_at: { type: Date, default: Date.now },
    coin: { type: Number, default: 0 },
    listFriend: { type: Array, default: [] },
    listFriend_request: { type: Array, default: [] },
    friendRequestSentList: { type: Array, default: [] },
    avatar: { type: String, default: 'defaultAvatar.png' },
    role: { type: String, default: 'user' },
    level: { type: Number, default: 1 },
    settings: {
        type: Object, default: {
            "sound": true,
            "language": "vi",
            "movementMode": "freeMode"
        }
    },
    exp: { type: Number, default: 0 },
    history_match: { type: Array, default: [] },
    inGame: { type: Boolean, default: false },
})

// User.pre('save', async function (next) {
//     try {
//         if (this.isModified('password')) {
//             const salt = await bcrypt.genSalt(10);
//             const passwordHashed = await bcrypt.hash(this.password, salt);
//             this.password = passwordHashed;
//         }
//         next();
//     } catch (error) {
//         next(error);
//     }
// })

// User.methods.isValidPassword = async function (password) {
//     try {
//         return await bcrypt.compare(password, this.password);
//     } catch (error) {
//         throw new Error(error);
//     }
// }



module.exports = mongoose.model('User', User)