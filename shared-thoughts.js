// Shared thoughts data for both admin and public views
const defaultThoughts = [
    {
        id: '1',
        title: "Growth vs. Innovation: The Cultural Trade-Off",
        content: "A of rapid global growth requires a different culture than one of focused innovation.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:30:00',
        category: 'Business'
    },
    {
        id: '2',
        title: "Daily Inspiration",
        content: "Start your day with a positive thought. It can change your entire day.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:30:00',
        category: 'Inspiration'
    },
    {
        id: '3',
        title: "Stay Motivated",
        content: "Your potential is endless. Keep pushing forward and never give up on your dreams.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:30:00',
        category: 'Motivational'
    },
    {
        id: '4',
        title: "The Power of Persistence",
        content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:31:00',
        category: 'Perseverance'
    },
    {
        id: '5',
        title: "Mindset Matters",
        content: "Your attitude, not your aptitude, will determine your altitude.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:31:00',
        category: 'Balance'
    },
    {
        id: '6',
        title: "Embrace Change",
        content: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:31:00',
        category: 'Inspiration'
    },
    {
        id: '7',
        title: "Continuous Learning",
        content: "The more you learn, the more you realize you don't know.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:32:00',
        category: 'Inspiration'
    },
    {
        id: '8',
        title: "The Art of Listening",
        content: "Most people do not listen with the intent to understand; they listen with the intent to reply.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:33:00',
        category: 'Communication'
    },
    {
        id: '9',
        title: "The Value of Time",
        content: "Time is what we want most, but what we use worst.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:33:00',
        category: 'Time Management'
    },
    {
        id: '10',
        title: "The Importance of Balance",
        content: "Balance is not something you find, it's something you create.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-07T17:33:00',
        category: 'Balance'
    },
    {
        id: '11',
        title: "Chase Light, Not Noise",
        content: "The world is loud, but not everything loud is meaningful. Follow what brings peace to your heart, even if it's quiet. The brightest paths are often the calmest.",
        addedBy: 'Thaughtify',
        timestamp: '2025-05-30T20:07:00',
        category: 'Motivational'
    },
    {
        id: '12',
        title: "Effort Defines Victory",
        content: "Winning is not everything, BUT the efforts to win is.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T21:47:00',
        category: 'Motivational'
    },
    {
        id: '13',
        title: "Identity Shapes Life",
        content: "Sense of Identity means a way of defining how you wish to live your life.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T21:47:00',
        category: 'Reality'
    },
    {
        id: '14',
        title: "Past Builds Identity",
        content: "We all need past. That's where our sense of Identity comes from.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T21:47:00',
        category: 'Reality'
    },
    {
        id: '15',
        title: "Rise Through Failure",
        content: "Success is not in never failing, but rising everytime you fail.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T23:22:00',
        category: 'Motivational'
    },
    {
        id: '16',
        title: "Rare Moral Valor",
        content: "Physical courage is so common in the world but Moral courage is so rare.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T23:22:00',
        category: 'Rarity'
    },
    {
        id: '17',
        title: "Commit more",
        content: "Life is continuously testing us for our level of Commitment.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T23:22:00',
        category: 'Motivational'
    },
    {
        id: '18',
        title: "Passion Fuels Vision",
        content: "A great man's courage to fulfill his vision comes from passion.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-05T23:22:00',
        category: 'Motivational'
    },
    {
        id: '19',
        title: "Individual Commitment helps in growth",
        content: "Individual commitment to a group effort is what makes a company work effectively.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T18:26:00',
        category: 'Communication, Perseverance'
    },
    {
        id: '20',
        title: "Stay Creative",
        content: "Creativity is the power to connect the seemingly unconnected.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T18:26:00',
        category: 'Perseverance'
    },
    {
        id: '21',
        title: "A good aim.",
        content: "The aim of the wise is not to secure pleasure, but to avoid pain.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T18:26:00',
        category: 'inspiration'
    },
    {
        id: '22',
        title: "Teamwork wins championships",
        content: "Talent wins game, but teamwork and intelligence wins championships.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T18:26:00',
        category: 'Reality'
    },
    {
        id: '23',
        title: "Create the future",
        content: "The best way to predict the future is to create it.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T18:26:00',
        category: 'Motivational'
    },
    {
        id: '24',
        title: "Commitment opens the path",
        content: "Commitment unlocks the door of imagination and vision.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T18:26:00',
        category: 'Motivational'
    },
    {
        id: '25',
        title: "Remove unwanted doubts",
        content: "The only limit to our realization of tomorrow is our doubts of today.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T18:26:00',
        category: 'Motivational'
    },
    {
        id: '26',
        title: "Identity covers oneself",
        content: "Identity is like a garment with which one covers oneself.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-06T18:26:00',
        category: 'Reality'
    },
    {
        id: '27',
        title: "Unlock More Options",
        content: "There is always a better strategy than the one you have.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Motivational'
    },
    {
        id: '28',
        title: "Think Differently",
        content: "To think creatively, we must be able to look differently.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Perseverance'
    },
    {
        id: '29',
        title: "Success Demands Patience",
        content: "To know how to wait is the great secret of success.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Reality'
    },
    {
        id: '30',
        title: "The Informed Leader",
        content: "A leader needs enough understanding to fashion an intelligent strategy.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Decision-Making'
    },
    {
        id: '31',
        title: "Hope, Caution, and Agility",
        content: "Expect the best, Plan for the worst & Prepare to be surprised.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Motivational'
    },
    {
        id: '32',
        title: "Commitment Makes It Real",
        content: "Unless commitment is made, there are only promises and hopes; but no plans.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Decision-Making, Motivational'
    },
    {
        id: '33',
        title: "Persistence Builds Power",
        content: "Strength and growth come only through continuous efforts.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Perseverance, Inspiration'
    },
    {
        id: '34',
        title: "Plans Die Without Sweat",
        content: "Plans are only good intentions unless they immediately degenerate into hard work.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Motivational'
    },
    {
        id: '35',
        title: "Now > Later",
        content: "A good plan violently executed NOW is better than a Perfect plan NEXT WEEK.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Decision-Making'
    },
    {
        id: '36',
        title: "Don’t Rush Becoming You",
        content: "Identity is such a crucial affair that one shouldn't rush into it.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Reality, Perseverance'
    },
    {
        id: '37',
        title: "Together Toward Tomorrow",
        content: "Teamwork is the ability to work togather towards a common vision.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:13:00',
        category: 'Communication, Motivational'
    },
    {
        id: '38',
        title: "Resilience Through Defeat",
        content: "The greatest test of courage on Earth is to bear defeat Without losing heart.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:48:00',
        category: 'Perseverance'
    },
    {
        id: '39',
        title: "Endless Commitment, Greatest Rewards",
        content: "Life's greatest rewards are reserved for those who demonstrate a never ending commitment.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:48:00',
        category: 'Inspiration'
    },
    {
        id: '40',
        title: "Unstoppable Courage",
        content: "Courage is going from Failure to Failure without losing Enthisiasm.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T01:48:00',
        category: 'Inspiration, Perseverance'
    },
    {
        id: '41',
        title: "Prioritize the Possible",
        content: "Impossible can wait but 'Difficult' has to be done now.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-10T18:07:00',
        category: 'Decision-Making'
    },
    {
        id: '42',
        title: "The Unachieved Beyond the Horizon",
        content: "Beyond the unseen and the undone lies the unachieved.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:09:00',
        category: 'Inspiration'
    },
    {
        id: '43',
        title: "Hold the Vision, Trust the Process",
        content: "Form a mental vision of your goal and cling to it through thick and thin.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:12:00',
        category: 'Perseverance'
    },
    {
        id: '44',
        title: "Make Ambition Work with What You Have",
        content: "Strategy is about stretching limited resources to fit ambitious aspirations.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:14:00',
        category: 'Reality'
    },
    {
        id: '45',
        title: "The Little Things Matter",
        content: "Be faithful in small things because it is in them that your strength lies.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:15:00',
        category: 'Perseverance'
    },
    {
        id: '46',
        title: "Responsibility Ends with Effort",
        content: "We are responsible for the effort, not the outcome.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:07:00',
        category: 'Motivational'
    },
    {
        id: '47',
        title: "Commitment with Passion",
        content: "When work, commitment and pleasure all become one, nothing is impossible.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:37:00',
        category: 'Inspiration'
    },
    {
        id: '48',
        title: "When Art Meets Strategy",
        content: "Creative without strategy is called art; Creative with stratagy is called advertising.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:38:00',
        category: 'Business'
    },
    {
        id: '49',
        title: "Goals Need Names",
        content: "The reason most people never reach their goal is that they dont define them.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:40:00',
        category: 'Decision-Making'
    },
    {
        id: '50',
        title: "Influence of Every Bond",
        content: "Each relationship nurtures a Strength or Weakness within you.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:41:00',
        category: 'Balance'
    },
    {
        id: '51',
        title: "The Chain to Happiness",
        content: "The secret of happiness is Freedom, and the secret of freedom  is Courage.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:42:00',
        category: 'Inspiration'
    },
    {
        id: '52',
        title: "No Advantage, No Excuse",
        content: "To be successful, you have to start without the advantages other people have.",
        addedBy: 'Thaughtify',
        timestamp: '2025-06-11T18:44:00',
        category: 'Perseverance'
    },
    {
        id: '53',
        title: "Small Eforts Matter",
        content: "Success is the sum of small efforts, repeated day in and day out.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:28:00',
        category: 'Perseverance'
    },
    {
        id: '54',
        title: "Progress Over Victory",
        content: "The Aim of argument, or discussion should not be victorious but progress.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:29:00',
        category: 'Communication'
    },
    {
        id: '55',
        title: "See the Distant Clearly",
        content: "In strategy it is important to see distant things to get a close view.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:31:00',
        category: 'Decision-Making, Strategy'
    },
    {
        id: '56',
        title: "Secret Knowledge Advantage",
        content: "The secret of success is to know something no one else know.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:34:00',
        category: 'Business'
    },
    {
        id: '57',
        title: "Together we Succeed",
        content: "Coming together, sharing together, working together succeeding together.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:35:00',
        category: 'Communication, Balance'
    },
    {
        id: '58',
        title: "Total Commitment Counts",
        content: "A total commitment is paramount to reaching ultimate in performance.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:37:00',
        category: 'Motivational'
    },
    {
        id: '59',
        title: "Strength of Character",
        content: "Strength of character means the ability to overcome resentment against others.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:38:00',
        category: 'Inspiration'
    },
    {
        id: '60',
        title: "Identity in Idleness",
        content: "To be idle requires a strong sense of personal Identity.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:39:00',
        category: 'Balance'
    },
    {
        id: '61',
        title: "Less Me, More We",
        content: "Teamwork; Simply stated, it is less me and more we.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:40:00',
        category: 'Communication'
    },
    {
        id: '62',
        title: "Effort Over Talent",
        content: "Continuous effort not strength or intelligence is the key to our success.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-23T11:42:00',
        category: 'Perseverance'
    },
    {
        id: '63',
        title: "Power of Personal Identity",
        content: "Strengthening our Identity is one way of reinforcing people's confidence.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:30:00',
        category: 'Inspiration'
    },
    {
        id: '64',
        title: "First, Get what you want. Second, Enjoy it",
        content: "There are two things to Aim at to get what you want and Enjoy it.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:32:00',
        category: 'Motivational'
    },
    {
        id: '65',
        title: "Education Inspires Action",
        content: "The great aim of education is not knowledge, but action.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:34:00',
        category: 'Inspiration'
    },
    {
        id: '66',
        title: "Unity Creates Strength",
        content: "Individually we are a drop and Together we are an ocean.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:36:00',
        category: 'Communication'
    },
    {
        id: '67',
        title: "Happiness Through Purpose",
        content: "If you want to live happy life, tie to a goal, not to people or things.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:37:00',
        category: 'Motivational'
    },
    {
        id: '68',
        title: "Courage to Be Yourself",
        content: "One of the most courageous things you can do is to identify yourself.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:39:00',
        category: 'Perseverance'
    },
    {
        id: '69',
        title: "Happiness by Helping Others",
        content: "Happiness is a byproduct of ann effort to make someone else happy.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:42:00',
        category: 'Inspiration'
    },
    {
        id: '70',
        title: "Collaboration Enables Achievement",
        content: "Alone we can do so little; Together we can do so much.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:43:00',
        category: 'Communication'
    },
    {
        id: '71',
        title: "Clear Organizational Purpose",
        content: "The Aim of an organization should be clear to everyone working in it.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:44:00',
        category: 'Business, Communication'
    },
    {
        id: '72',
        title: "Commitment Drives Greatness",
        content: "Great organizations demand High level of Commitment.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:45:00',
        category: 'Business'
    },
    {
        id: '73',
        title: "Strive for Your Best",
        content: "Always Aim to be the best in what you do and give 100%.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:47:00',
        category: 'Motivational'
    },
    {
        id: '74',
        title: "Strategy Before Planning",
        content: "Strategy is not the consequence of planning. but the opposite: It's the starting point.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:49:00',
        category: 'Motivational'
    },
    {
        id: '75',
        title: "Measure Strategy by Results",
        content: "However beautiful the strategy, you should occasionally look at the Results.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:50:00',
        category: 'Business'
    },
    {
        id: '76',
        title: "Power of True Commitment",
        content: "No one can keep a Committed person from succeeding.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:51:00',
        category: 'Perseverance, Motivational'
    },
    {
        id: '77',
        title: "Strength from Facing Fears",
        content: "Each time we face our fear, we gain strength and courage in the doing.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:52:00',
        category: 'Perseverance'
    },
    {
        id: '78',
        title: "Goodness with a Purpose",
        content: "Aim above morality, Be not simple good, Be good for something.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:53:00',
        category: 'Inspiration'
    },
    {
        id: '79',
        title: "Creativity Fuels Innovation",
        content: "Necessity is the mother of invention but its father is creativity.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:55:00',
        category: 'Business, Inspiration'
    },
    {
        id: '80',
        title: "Balance Planning and Action",
        content: "Planning without action is futile, action without planning is fatal.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:55:00',
        category: 'Decision-Making, Business'
    },
    {
        id: '81',
        title: "Turn Worry Into Planning",
        content: "Let our advance worrying become advance thinking and planning.",
        addedBy: 'Thaughtify',
        timestamp: '2025-08-29T17:56:00',
        category: 'Time Management, Decision-Making'
    }
    
];

// Make the defaultThoughts available globally
window.defaultThoughts = defaultThoughts;