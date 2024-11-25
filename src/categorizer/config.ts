export const CATEGORIES_KEYWORDS = {
    travel: [
        "flight", "travel", "vacation", "check-in", "hotel", "trip",
        "road trip", "cruise", "layover", "airport", "departure",
        "arrival", "itinerary", "tour", "resort", "luggage",
        "rental car", "train", "station", "journey", "getaway",
        "adventure", "backpacking", "holiday", "exploration", "sightseeing",
        "road trip", "overnight", "glamping", "staycation", "excursion",
        "bus tour", "cabin", "hostel", "Airbnb", "resort", "stay"
    ],
    work: [
        "meeting", "deadline", "presentation", "review", "project",
        "conference", "workshop", "client", "briefing", "proposal",
        "pitch", "brainstorm", "interview", "training", "planning",
        "strategy", "sprint", "task", "check-in", "team",
        "demo", "follow-up", "sync", "report", "stand-up",
        "quarterly", "OKR", "performance", "collaboration", "retrospective",
        "scrum", "one-on-one", "seminar", "conference call", "huddle",
        "conference room", "networking", "presentation", "webinar", "coaching"
    ],
    social: [
        "party", "dinner", "event", "festival", "celebrate",
        "housewarming", "call", "birthday", "gathering",
        "hangout", "BBQ", "brunch", "reunion", "farewell",
        "movie", "concert", "show", "play", "game night",
        "club", "bar", "karaoke", "dance", "picnic",
        "engagement", "wedding", "shower", "anniversary", "family reunion",
        "baby shower", "graduation", "holiday party", "theatre",
        "sporting event", "reception", "potluck", "friendsgiving",
        "fundraiser", "baby announcement", "open house", "bonfire",
        "tailgate", "cheer", "celebration", "hangout", "night out"
    ],
    fitness: [
        "gym", "yoga", "workout", "game", "tryout", "practice", "training",
        "match", "tournament", "league", "pickleball", "spinning", "boxing",
        "kickboxing", "MMA", "zumba", "HIIT", "aerobics", "strength training",
        "bodybuilding", "football", "rugby", "golf", "bowling", "ice skating",
        "skateboarding", "climbing", "dance class", "fitness test", "marathon",
        "race", "swim", "surf", "hike", "climb", "cycling", "biking", "walk",
        "soccer", "basketball", "tennis", "volleyball", "rowing", "triathlon",
        "pilates", "crossfit", "baseball", "hockey", "cricket", "handball", "ping pong",
        "lacrosse", "track and field", "badminton", "wrestling", "boxing",
        "motorsport", "snowboarding", "skiing", "snowshoeing", "swimming",
        "archery", "equestrian", "fencing", "martial arts", "softball",
        "ultimate frisbee"
    ],
    personal: [
        "appointment", "errand", "family", "doctor", "pet",
        "therapy", "dentist", "optometrist", "spa", "massage",
        "haircut", "grocery", "shopping", "school", "pickup",
        "drop-off", "bank", "insurance", "lawyer", "taxes",
        "maintenance", "repair", "cleaning", "study", "home",
        "gardening", "chores", "delivery", "baby", "kids",
        "volunteer", "charity", "donation", "homework", "routine",
        "personal care", "grooming", "laundry", "house cleaning",
        "car maintenance", "vet visit", "house repair", "renovation",
        "massage", "nail appointment", "hair coloring", "self-care",
        "counseling", "doctor's visit", "dentist appointment",
        "physical therapy", "health check-up", "emergency"
    ]
};

export const FUSE_OPTIONS = {
    includeScore: true,
    includeMatches: true,
    isCaseSensitive: false,
    threshold: 0.5,
    findAllMatches: true,
    ignoreLocation: true,
    distance: 400
}