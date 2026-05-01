import express from 'express'
import Ending from '../db/ending.js'

const router = express.Router()

const defaultEndings = [
    {
        endingId: 'academic-success',
        endingKey: 'academic-success',
        title: 'Academic Success',
        status: 'Locked',
        category: 'Study',
        description: 'You focused on study and achieved strong academic results.',
        image: 'ending-academic-success.png',
    },
    {
        endingId: 'balanced-life',
        endingKey: 'balanced-life',
        title: 'Balanced Life',
        status: 'Locked',
        category: 'Balance',
        description:
            'You balanced study, health, and daily life as an international student.',
        image: 'ending-balanced-life.png',
    },
    {
        endingId: 'burnout-ending',
        endingKey: 'burnout-ending',
        title: 'Burnout Ending',
        status: 'Locked',
        category: 'Health',
        description:
            'You pushed yourself too hard and forgot to take care of your health.',
        image: 'ending-burnout-ending.png',
    },
    {
        endingId: 'financial-freedom',
        endingKey: 'financial-freedom',
        title: 'Financial Freedom',
        status: 'Locked',
        category: 'Wealth',
        description:
            'You managed money carefully and became financially stable.',
        image: 'ending-financial-freedom.png',
    },
    {
        endingId: 'social-butterfly',
        endingKey: 'social-butterfly',
        title: 'Social Butterfly',
        status: 'Locked',
        category: 'Social',
        description:
            'You built strong friendships and enjoyed your student life.',
        image: 'ending-social-butterfly.png',
    },
    {
        endingId: 'homesick-heart',
        endingKey: 'homesick-heart',
        title: 'Homesick Heart',
        status: 'Locked',
        category: 'Emotion',
        description: 'You missed home deeply while studying overseas.',
        image: 'ending-homesick-heart.png',
    },
    {
        endingId: 'money-over-everything',
        endingKey: 'money-over-everything',
        title: 'Money Over Everything',
        status: 'Locked',
        category: 'Wealth',
        description:
            'You focused too much on money and lost sight of other parts of life.',
        image: 'ending-money-over-everything.png',
    },
    {
        endingId: 'lost-in-choices',
        endingKey: 'lost-in-choices',
        title: 'Lost in Choices',
        status: 'Locked',
        category: 'Decision',
        description:
            'Too many choices made your journey confusing and uncertain.',
        image: 'ending-lost-in-choices.png',
    },
]

async function seedOrUpdateDefaultEndings() {
    for (const ending of defaultEndings) {
        await Ending.updateOne(
            {
                $or: [
                    { endingId: ending.endingId },
                    { endingKey: ending.endingKey },
                ],
            },
            {
                $set: {
                    endingId: ending.endingId,
                    endingKey: ending.endingKey,
                    title: ending.title,
                    category: ending.category,
                    description: ending.description,
                    image: ending.image,
                },
                $setOnInsert: {
                    status: ending.status,
                },
            },
            {
                upsert: true,
            },
        )
    }
}

router.get('/', async (req, res) => {
    try {
        await seedOrUpdateDefaultEndings()

        const endings = await Ending.find({}).lean()

        const sortedEndings = defaultEndings
            .map((defaultEnding) =>
                endings.find(
                    (ending) =>
                        ending.endingId === defaultEnding.endingId ||
                        ending.endingKey === defaultEnding.endingKey,
                ),
            )
            .filter(Boolean)

        const unlocked = sortedEndings.filter(
            (ending) => ending.status === 'Unlocked',
        ).length

        const locked = sortedEndings.filter(
            (ending) => ending.status === 'Locked',
        ).length

        return res.json({
            success: true,
            total: sortedEndings.length,
            unlocked,
            locked,
            data: sortedEndings,
        })
    } catch (error) {
        console.error('Failed to get endings detail:')
        console.error(error)

        return res.status(500).json({
            success: false,
            message: 'Failed to get endings',
            error: error.message,
        })
    }
})

router.get('/:endingId', async (req, res) => {
    try {
        const { endingId } = req.params

        const ending = await Ending.findOne({
            $or: [{ endingId }, { endingKey: endingId }],
        }).lean()

        if (!ending) {
            return res.status(404).json({
                success: false,
                message: 'Ending not found',
            })
        }

        return res.json({
            success: true,
            data: ending,
        })
    } catch (error) {
        console.error('Failed to get ending detail:')
        console.error(error)

        return res.status(500).json({
            success: false,
            message: 'Failed to get ending',
            error: error.message,
        })
    }
})

router.patch('/:endingId/unlock', async (req, res) => {
    try {
        const { endingId } = req.params

        const ending = await Ending.findOneAndUpdate(
            {
                $or: [{ endingId }, { endingKey: endingId }],
            },
            {
                status: 'Unlocked',
            },
            {
                new: true,
            },
        ).lean()

        if (!ending) {
            return res.status(404).json({
                success: false,
                message: 'Ending not found',
            })
        }

        return res.json({
            success: true,
            message: 'Ending unlocked successfully',
            data: ending,
        })
    } catch (error) {
        console.error('Failed to unlock ending detail:')
        console.error(error)

        return res.status(500).json({
            success: false,
            message: 'Failed to unlock ending',
            error: error.message,
        })
    }
})

export default router