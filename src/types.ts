export interface Person {
    id: string;
    name: string;
    notes?: string;
    parents: string[];
    children: string[];
    spouses: string[];
    raw_dates?: string;
    // Computed/UI fields
    gender?: 'M' | 'F';
    born?: string;
    died?: string;
}

export interface FamilyData {
    persons: Person[];
}
