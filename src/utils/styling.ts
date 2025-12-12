export const getGenColor = (gen: number) => {
    if (gen === 0) return "bg-emerald-500 text-white"; // Root (You)
    if (gen > 0) return "bg-indigo-500 text-white"; // Ancestors
    return "bg-amber-500 text-white"; // Children
};

export const getGenLabel = (gen: number) => {
    if (gen === 0) return "Vous / Racine";
    if (gen === 1) return "Parents";
    if (gen === 2) return "Grands-Parents";
    if (gen === 3) return "Arrière-Grands-Parents";
    if (gen === 4) return "Tisaïeuls (GGG)";
    if (gen >= 5) return "Ancêtres";
    if (gen === -1) return "Enfants";
    if (gen === -2) return "Petits-Enfants";
    if (gen <= -3) return "Descendants";
    return "Génération " + gen;
};

export const getBadgeColor = (gen: number) => {
    if (gen === 0) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (gen > 0) return "bg-indigo-100 text-indigo-800 border-indigo-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
};
