export const endingData = [
    {
        endingId: 'model-minority-real-version',
        endingKey: 'model-minority-real-version',
        title: 'The Model Minority Myth: Real Version',
        category: 'Balance',
        description:
            'You achieved the legendary balance: decent grades, decent health, and a bank account that has not completely hit rock bottom. You are not just studying abroad — you are accidentally writing the survival guide for future international students.',
        image: 'ending-model-minority-real-version.png',
        gameResultId: null,
    },
    {
        endingId: 'library-resident-landlord',
        endingKey: 'library-resident-landlord',
        title: 'Library’s Resident Landlord',
        category: 'Study',
        description:
            'Your Intelligence stat has officially overflowed. Every seat in the library has witnessed your academic suffering, and several of them may legally count as your second home.',
        image: 'ending-library-resident-landlord.png',
        gameResultId: null,
    },
    {
        endingId: 'gpa-4-hairline-04',
        endingKey: 'gpa-4-hairline-04',
        title: 'GPA: 4.0, Hairline: 0.4',
        category: 'Health',
        description:
            'Your transcript is flawless, almost suspiciously so, but your eye bags have migrated all the way to your chin. You defeated academia, but your physical condition became fragile.',
        image: 'ending-gpa-4-hairline-04.png',
        gameResultId: null,
    },
    {
        endingId: 'main-character-party',
        endingKey: 'main-character-party',
        title: 'The Main Character of Every Party',
        category: 'Social',
        description:
            'Every student club has heard your name, and your contact list is longer than your course timetable. Somehow, you turned campus life into your personal reality show.',
        image: 'ending-main-character-party.png',
        gameResultId: null,
    },
    {
        endingId: 'part-time-tycoon',
        endingKey: 'part-time-tycoon',
        title: 'Part-time Tycoon',
        category: 'Wealth',
        description:
            'During your time abroad, you developed enough survival skills to run a profitable convenience store on a deserted island. You may be tired, but you are financially dangerous.',
        image: 'ending-part-time-tycoon.png',
        gameResultId: null,
    },
    {
        endingId: 'smart-head-empty-pocket',
        endingKey: 'smart-head-empty-pocket',
        title: 'Smart Head, Empty Pocket',
        category: 'Study',
        description:
            'Your brain is packed with cutting-edge theories, but your stomach is powered by discounted bread and emotional resilience. Spiritually, you are a billionaire. Financially, not so much.',
        image: 'ending-smart-head-empty-pocket.png',
        gameResultId: null,
    },
    {
        endingId: 'showed-up-survived',
        endingKey: 'showed-up-survived',
        title: 'I Showed Up, I Survived',
        category: 'Normal',
        description:
            'You did not become a legend, but you also did not become a cautionary tale. With your degree in hand, your life philosophy remains simple: go with the flow and act like this was the plan all along.',
        image: 'ending-showed-up-survived.png',
        gameResultId: null,
    },
    {
        endingId: 'speedrun-early-retirement',
        endingKey: 'speedrun-early-retirement',
        title: 'Speedrun to Early Retirement',
        category: 'Game Over',
        description:
            'Everything collapsed. One of your attributes hit zero so hard that your life basically pressed the restart button by itself.',
        image: 'ending-speedrun-early-retirement.png',
        gameResultId: null,
    },
]

export const ENDING_COLLECTION_MAP = Object.fromEntries(
    endingData
        .filter((e) => e.gameResultId !== null)
        .map((e) => [e.gameResultId, e.endingKey]),
)