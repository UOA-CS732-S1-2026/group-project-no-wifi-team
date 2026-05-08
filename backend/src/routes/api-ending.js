import express from 'express'
import Ending from '../db/ending.js'
import { endingData } from '../data/endingData.js'

const router = express.Router()

async function seedOrUpdateDefaultEndings() {
    for (const ending of endingData) {
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
                    status: 'Locked',
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

        const sortedEndings = endingData
            .map((def) =>
                endings.find(
                    (e) => e.endingId === def.endingId || e.endingKey === def.endingKey,
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