/**
 * Canonical ending definitions for the collection gallery.
 * Used by api-ending.js (seed / CRUD) and api-game.js (auto-unlock after a game result).
 *
 * endingId / endingKey   — unique DB identifiers (kept equal for simplicity)
 * gameResultId           — the matching id from the frontend ENDINGS array in endingResult.ts;
 *                          null means this ending has no automatic game-result trigger
 */
export const endingData = [
    {
        endingId: 'academic-success',
        endingKey: 'academic-success',
        title: 'Academic Success',
        category: 'Study',
        description: 'You focused on study and achieved strong academic results.',
        image: 'ending-academic-success.png',
        gameResultId: 'academic-star',
    },
    {
        endingId: 'balanced-life',
        endingKey: 'balanced-life',
        title: 'Balanced Life',
        category: 'Balance',
        description:
            'You balanced study, health, and daily life as an international student.',
        image: 'ending-balanced-life.png',
        gameResultId: 'perfect-all-rounder',
    },
    {
        endingId: 'burnout-ending',
        endingKey: 'burnout-ending',
        title: 'Burnout Ending',
        category: 'Health',
        description:
            'You pushed yourself too hard and forgot to take care of your health.',
        image: 'ending-burnout-ending.png',
        gameResultId: 'burnout-student',
    },
    {
        endingId: 'financial-freedom',
        endingKey: 'financial-freedom',
        title: 'Financial Freedom',
        category: 'Wealth',
        description:
            'You managed money carefully and became financially stable.',
        image: 'ending-financial-freedom.png',
        gameResultId: 'part-time-hustler',
    },
    {
        endingId: 'social-butterfly',
        endingKey: 'social-butterfly',
        title: 'Social Butterfly',
        category: 'Social',
        description:
            'You built strong friendships and enjoyed your student life.',
        image: 'ending-social-butterfly.png',
        gameResultId: 'steady-graduate',
    },
    {
        endingId: 'homesick-heart',
        endingKey: 'homesick-heart',
        title: 'Homesick Heart',
        category: 'Emotion',
        description: 'You missed home deeply while studying overseas.',
        image: 'ending-homesick-heart.png',
        gameResultId: null,
    },
    {
        endingId: 'money-over-everything',
        endingKey: 'money-over-everything',
        title: 'Money Over Everything',
        category: 'Wealth',
        description:
            'You focused too much on money and lost sight of other parts of life.',
        image: 'ending-money-over-everything.png',
        gameResultId: null,
    },
    {
        endingId: 'lost-in-choices',
        endingKey: 'lost-in-choices',
        title: 'Lost in Choices',
        category: 'Decision',
        description:
            'Too many choices made your journey confusing and uncertain.',
        image: 'ending-lost-in-choices.png',
        gameResultId: 'lost-year',
    },
]

/**
 * Derived map: frontend game-result ending id → collection endingKey.
 * Consumed by api-game.js to auto-unlock the matching collection ending
 * whenever a game result is saved.
 */
export const ENDING_COLLECTION_MAP = Object.fromEntries(
    endingData
        .filter((e) => e.gameResultId !== null)
        .map((e) => [e.gameResultId, e.endingKey]),
)
