import mongoose from 'mongoose'

const endingSchema = new mongoose.Schema(
    {
        endingId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        // 兼容旧数据库里的 unique index: endingKey_1
        endingKey: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ['Unlocked', 'Locked'],
            default: 'Locked',
        },

        category: {
            type: String,
            default: '',
        },

        description: {
            type: String,
            default: '',
        },

        image: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    },
)

const Ending = mongoose.model('Ending', endingSchema)

export default Ending