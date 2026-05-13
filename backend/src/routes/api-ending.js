import express from 'express'
import Ending from '../db/ending.js'
import { User } from '../db/user.js'
import { UserStats } from '../db/userStats.js'
import { endingData } from '../data/endingData.js'
import { authOptional } from '../middleware/auth.js'

const router = express.Router()

async function seedOrUpdateDefaultEndings() {
    for (const ending of endingData) {
        await Ending.updateOne(
            { endingId: ending.endingId },
            {
                $set: {
                    endingId: ending.endingId,
                    endingKey: ending.endingKey,
                    title: ending.title,
                    category: ending.category,
                    description: ending.description,
                    image: ending.image,
                    isDeleted: false,
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

router.get('/', authOptional, async (req, res) => {
    try {
        await seedOrUpdateDefaultEndings()

        const stats = req.userId ? await UserStats.findOne({ userId: req.userId }).lean() : null
        const unlockedEndingKeys = new Set(stats?.endings ?? [])

        const endings = await Ending.find({ isDeleted: { $ne: true } }).lean()

        const sortedEndings = endingData
            .map((def) => endings.find((e) => e.endingId === def.endingId))
            .filter(Boolean)
            .map((ending) => ({
                ...ending,
                status: unlockedEndingKeys.has(ending.endingId) ? 'Unlocked' : 'Locked',
            }))

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

router.get('/:endingId', authOptional, async (req, res) => {
    try {
        const { endingId } = req.params
        const stats = req.userId ? await UserStats.findOne({ userId: req.userId }).lean() : null

        const ending = await Ending.findOne({
            endingId,
            isDeleted: { $ne: true },
        }).lean()

        if (!ending) {
            return res.status(404).json({
                success: false,
                message: 'Ending not found',
            })
        }

        return res.json({
            success: true,
            data: {
                ...ending,
                status: stats?.endings?.includes(ending.endingId) ? 'Unlocked' : 'Locked',
            },
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

router.patch('/:endingId/unlock', authOptional, async (req, res) => {
    try {
        const { endingId } = req.params

        if (req.userId) {
            const user = await User.findOne({ userId: req.userId, isDeleted: { $ne: true } }).lean();
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                })
            }
            await UserStats.updateOne(
                { userId: req.userId },
                { $addToSet: { endings: endingId } },
                { upsert: true },
            );

            const ending = await Ending.findOne({
                endingId,
                isDeleted: { $ne: true },
            }).lean()

            if (!ending) {
                return res.status(404).json({
                    success: false,
                    message: 'Ending not found',
                })
            }

            return res.json({
                success: true,
                message: 'Ending unlocked successfully',
                data: { ...ending, status: 'Unlocked' },
            })
        }

        return res.status(401).json({
            success: false,
            message: 'Authentication required to unlock endings',
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
