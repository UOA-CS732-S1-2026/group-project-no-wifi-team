import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import endingRoutes from './routes/api-ending.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
)

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'International Student Simulator backend is running',
    })
})

app.use('/api/endings', endingRoutes)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found',
    })
})

async function startServer() {
    try {
        if (!DB_URL) {
            throw new Error('DB_URL is missing in .env file')
        }

        await mongoose.connect(DB_URL)

        console.log('MongoDB connected successfully')

        app.listen(PORT, () => {
            console.log(`Backend server is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Failed to start backend server:', error)
        process.exit(1)
    }
}

startServer()