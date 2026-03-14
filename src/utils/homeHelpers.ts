export const categoryLabelMap: Record<string, string> = {
    sandwiches: "BURGER LINEUP",
    sides: "SIDES & EXTRAS",
    beverages: "COLD DRINKS",
    desserts: "SWEET TREATS",
};

export const categoryAliases: Record<string, string[]> = {
    sandwiches: ["burg", "sand", "burger", "burgers", "sandwich", "sandwiches"],
    sides: ["side", "sides", "snac", "snacks"],
    beverages: ["drin", "drink", "drinks", "beverage", "beverages", "soda", "sodas"],
    desserts: ["swee", "dessert", "desserts", "sweet", "sweets"],
};

export const funMessages = [
    "Hmm… nice choice 😋",
    "This one is delicious 🔥",
    "Classic pick. Respect 👌",
    "Fast Fuel approved ✅",
    "You’ve got good taste 😄",
    "Okayyy, that’s a winner 🏆",
];

export const pluralMessages = [
    "Nice! Here are some options 😋",
    "Found a few matches 🔥",
    "Good picks — take a look 👀",
    "Fast Fuel options coming up ✅",
];

export const cleanProductName = (name: string) => name.split("/")[0].trim();

export function pickPluralMessage(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return pluralMessages[hash % pluralMessages.length];
}

export function detectCategory(term: string) {
    const t = term.trim().toLowerCase();
    if (!t) return null;

    for (const [category, aliases] of Object.entries(categoryAliases)) {
        if (aliases.some((alias) => t.includes(alias))) {
            return category;
        }
    }

    return null;
}

export function pickMessage(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return funMessages[hash % funMessages.length];
}

export const getCategoryLabel = (cat: string | null) =>
    cat ? categoryLabelMap[cat] ?? cat : "";