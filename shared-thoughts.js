// Shared thoughts data for both admin and public views
const defaultThoughts = [
    {
        id: '1',
        title: "Growth vs. Innovation: The Cultural Trade-Off",
        content: "A strategy of rapid global growth requires a different culture than one of focused innovation.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Business'
    },
    {
        id: '2',
        title: "Daily Inspiration",
        content: "Start your day with a positive thought. It can change your entire day.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Inspiration'
    },
    {
        id: '3',
        title: "Stay Motivated",
        content: "Your potential is endless. Keep pushing forward and never give up on your dreams.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Motivation'
    },
    {
        id: '4',
        title: "The Power of Persistence",
        content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Perseverance'
    },
    {
        id: '5',
        title: "Mindset Matters",
        content: "Your attitude, not your aptitude, will determine your altitude.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Mindset'
    },
    {
        id: '6',
        title: "Embrace Change",
        content: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Change'
    },
    {
        id: '7',
        title: "Continuous Learning",
        content: "The more you learn, the more you realize you don't know.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Learning'
    },
    {
        id: '8',
        title: "The Art of Listening",
        content: "Most people do not listen with the intent to understand; they listen with the intent to reply.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Communication'
    },
    {
        id: '9',
        title: "The Value of Time",
        content: "Time is what we want most, but what we use worst.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Time Management'
    },
    {
        id: '10',
        title: "The Importance of Balance",
        content: "Balance is not something you find, it's something you create.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T12:00:00.000Z',
        category: 'Balance'
    },
    {
        id: '11',
        title: "Chase Light, Not Noise",
        content: "The world is loud, but not everything loud is meaningful. Follow what brings peace to your heart, even if it's quiet. The brightest paths are often the calmest.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-30T14:37:00.000Z',
        category: 'Motivational'
    },
    {
        id: '12',
        title: "Effort Defines Victory",
        content: "Winning is not everything, BUT the efforts to win is.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T16:17:00.000Z',
        category: 'Motivational'
    },
    {
        id: '13',
        title: "Identity Shapes Life",
        content: "Sense of Identity means a way of defining how you wish to live your life.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T16:17:00.000Z',
        category: 'Reality'
    },
    {
        id: '14',
        title: "Past Builds Identity",
        content: "We all need past. That's where our sense of Identity comes from.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T16:17:00.000Z',
        category: 'Reality'
    },
    {
        id: '15',
        title: "Rise Through Failure",
        content: "Success is not in never failing, but rising everytime you fail.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T17:52:00.000Z',
        category: 'Motivational'
    },
    {
        id: '16',
        title: "Rare Moral Valor",
        content: "Physical courage is so common in the world but Moral courage is so rare.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T17:52:00.000Z',
        category: 'Rarity'
    },
    {
        id: '17',
        title: "Commit more",
        content: "Life is continuously testing us for our level of Commitment.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T17:52:00.000Z',
        category: 'Motivational'
    },
    {
        id: '18',
        title: "Passion Fuels Vision",
        content: "A great man's courage to fulfill his vision comes from passion.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T17:52:00.000Z',
        category: 'Motivational'
    },
    {
        id: '19',
        title: "Individual Commitment helps in growth",
        content: "Individual commitment to a group effort is what makes a company work effectively.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T12:56:00.000Z',
        category: 'Communication, Perseverance'
    },
    {
        id: '20',
        title: "Stay Creative",
        content: "Creativity is the power to connect the seemingly unconnected.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T12:56:00.000Z',
        category: 'Perseverance'
    },
    {
        id: '21',
        title: "A good aim.",
        content: "The aim of the wise is not to secure pleasure, but to avoid pain.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T12:56:00.000Z',
        category: 'inspiration'
    },
    {
        id: '22',
        title: "Teamwork wins championships",
        content: "Talent wins game, but teamwork and intelligence wins championships.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T12:56:00.000Z',
        category: 'Reality'
    },
    {
        id: '23',
        title: "Create the future",
        content: "The best way to predict the future is to create it.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T12:56:00.000Z',
        category: 'Motivational'
    },
    {
        id: '24',
        title: "Commitment opens the path",
        content: "Commitment unlocks the door of imagination and vision.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T12:56:00.000Z',
        category: 'Motivational'
    },
    {
        id: '25',
        title: "Remove unwanted doubts",
        content: "The only limit to our realization of tomorrow is our doubts of today.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T12:56:00.000Z',
        category: 'Motivational'
    },
    {
        id: '26',
        title: "Identity covers oneself",
        content: "Identity is like a garment with which one covers oneself.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T12:56:00.000Z',
        category: 'Reality'
    },
];

// Make the defaultThoughts available globally
window.defaultThoughts = defaultThoughts;
