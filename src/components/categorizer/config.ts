export const CATEGORIES_KEYWORDS = {
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
        "ultimate frisbee", "spikeball", "cornhole", "dodgeball", "kickball", "spike",
        "hiking", "running", "jogging", "jog", "walking", "biking", "cycling",
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
        "tailgate", "cheer", "celebration", "hangout", "night out", "food", "dinner",
        "lunch", "breakfast", "brunch", "happy hour", "social gathering", "movie", "film",
        "concert", "show", "play", "theatre", "performance", "game night", "board games",
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
        "physical therapy", "health check-up", "emergency", "doc", "physician",
    ],
    travel: [
        "flight", "travel", "vacation", "check-in", "hotel", "trip",
        "road trip", "cruise", "layover", "airport", "departure",
        "arrival", "itinerary", "tour", "resort", "luggage",
        "rental car", "train", "station", "journey", "getaway",
        "adventure", "backpacking", "holiday", "exploration", "sightseeing",
        "road trip", "overnight", "glamping", "staycation", "excursion",
        "bus tour", "cabin", "hostel", "Airbnb", "resort", "stay"
    ],
};

export const FUSE_OPTIONS = {
    includeScore: true,
    includeMatches: true,
    isCaseSensitive: false,
    threshold: 0.45,
    findAllMatches: true,
    ignoreLocation: true,
    distance: 800
}