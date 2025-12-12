import React from 'react';
import type { Person } from '../types';
import { getGenLabel, getBadgeColor } from '../utils/styling';
import {
    X,
    Calendar,
    NotebookPen,
    UserPlus,
    Baby,
    Heart,
    Users,
    ChevronRight,
    Edit3,
    Trash2,
    Link as LinkIcon
} from 'lucide-react';
import clsx from 'clsx';

interface DetailPanelProps {
    person: Person;
    generation: number;
    onClose: () => void;
    onAddParent: () => void;
    onAddChild: () => void;
    onAddSpouse: () => void;
    onRelationClick: (type: 'parents' | 'children' | 'spouses') => void;
    onUpdate: (field: keyof Person, value: string) => void;
    onDelete?: () => void;
    onLink?: (targetId: string, relation: 'parent' | 'child' | 'spouse') => void;
    allPersons?: Person[];
}

export default function DetailPanel({
    person,
    generation,
    onClose,
    onAddParent,
    onAddChild,
    onAddSpouse,
    onRelationClick,
    onUpdate,
    onDelete,
    onLink,
    allPersons
}: DetailPanelProps) {
    const initials = person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const genLabel = getGenLabel(generation);
    const badgeClass = getBadgeColor(generation);

    return (
        <div className="w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out absolute right-0 top-0 bottom-0 z-20">
            {/* 1. Header with Gradient and Actions */}
            <div className="relative h-24 bg-gradient-to-r from-slate-100 to-slate-200 overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-4 flex gap-2">
                    <button onClick={onClose} className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-slate-500 hover:text-slate-800 transition-all shadow-sm group" title="Fermer">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 -mt-10 relative">

                {/* 2. Identity Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className={clsx("w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold mb-4 bg-slate-50 text-slate-400")}>
                        {initials}
                    </div>

                    {/* Editable Name */}
                    <input
                        className="text-2xl font-bold text-slate-900 text-center leading-tight mb-2 bg-transparent hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded px-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        value={person.name}
                        onChange={(e) => onUpdate && onUpdate('name', e.target.value)}
                        placeholder="Nom complet"
                    />

                    <div className="flex flex-wrap gap-2 justify-center items-center mb-3">
                        <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", badgeClass)}>
                            {genLabel}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-sm justify-center w-full">
                        <Calendar size={14} className="opacity-70 shrink-0" />
                        <input
                            className="bg-transparent hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded px-2 italic font-medium text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all w-48"
                            value={person.raw_dates || ""}
                            onChange={(e) => onUpdate && onUpdate('raw_dates', e.target.value)}
                            placeholder="Dates (ex: 1980 - 2024)"
                        />
                    </div>
                </div>

                {/* 3. Notes Section */}
                <div className="mb-8 group">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        <NotebookPen size={14} />
                        Notes
                    </label>
                    <div className="relative">
                        <textarea
                            className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border-2 border-slate-100 hover:border-slate-200 focus:border-indigo-500 rounded-xl p-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 min-h-[120px] resize-none"
                            value={person.notes || ''}
                            onChange={(e) => onUpdate && onUpdate('notes', e.target.value)}
                            placeholder="Ajouter une note..."
                        />
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 size={14} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* 4. Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Actions Rapides</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={onAddParent} className="flex items-center p-3 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 text-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                <UserPlus size={18} className="text-blue-600" />
                            </div>
                            <span className="font-semibold text-sm">Ajouter Parent</span>
                        </button>

                        <button onClick={onAddChild} className="flex items-center p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                            <div className="p-2 bg-emerald-100 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                <Baby size={18} className="text-emerald-600" />
                            </div>
                            <span className="font-semibold text-sm">Ajouter Enfant</span>
                        </button>

                        <button onClick={onAddSpouse} className="flex items-center p-3 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-700 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                            <div className="p-2 bg-rose-100 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                                <Heart size={18} className="text-rose-600" />
                            </div>
                            <span className="font-semibold text-sm">Ajouter Conjoint</span>
                        </button>
                    </div>
                </div>

                {/* 5. Link Person Section */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <LinkIcon size={14} />
                        Relier Existant
                    </h3>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <select
                            className="w-full text-sm p-2 mb-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                            onChange={(e) => {
                                // Store temporarily or use state? 
                                // For simplicity, we just trigger immediately if confirm? No, need state.
                                // Let's use a local ref or state. Since I can't add state easily without huge refactor,
                                // I will use a simple prompt-based approach for now or assume state?
                                // Actually, I need to add state to this component.
                            }}
                            id="link-select"
                        >
                            <option value="">Choisir une personne...</option>
                            {allPersons?.filter(p => p.id !== person.id).sort((a, b) => a.name.localeCompare(b.name)).map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button onClick={() => {
                                const select = document.getElementById('link-select') as HTMLSelectElement;
                                if (select.value) onLink && onLink(select.value, 'parent');
                            }} className="flex-1 py-1 px-2 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 font-medium">
                                Parent
                            </button>
                            <button onClick={() => {
                                const select = document.getElementById('link-select') as HTMLSelectElement;
                                if (select.value) onLink && onLink(select.value, 'child');
                            }} className="flex-1 py-1 px-2 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-medium">
                                Enfant
                            </button>
                            <button onClick={() => {
                                const select = document.getElementById('link-select') as HTMLSelectElement;
                                if (select.value) onLink && onLink(select.value, 'spouse');
                            }} className="flex-1 py-1 px-2 text-xs bg-rose-100 text-rose-700 rounded hover:bg-rose-200 font-medium">
                                Conjoint
                            </button>
                        </div>
                    </div>
                </div>

                {/* 6. Relations */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Relations
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                            {person.parents.length + person.children.length + person.spouses.length}
                        </span>
                    </h3>

                    <div className="space-y-3">
                        <RelationCard
                            label="Parents"
                            count={person.parents.length}
                            icon={<Users size={16} />}
                            color="indigo"
                            onClick={() => onRelationClick('parents')}
                        />
                        <RelationCard
                            label="Enfants"
                            count={person.children.length}
                            icon={<Baby size={16} />}
                            color="emerald"
                            onClick={() => onRelationClick('children')}
                        />
                        <RelationCard
                            label="Conjoints"
                            count={person.spouses.length}
                            icon={<Heart size={16} />}
                            color="rose"
                            onClick={() => onRelationClick('spouses')}
                        />
                    </div>
                </div>

                {/* 7. Danger Zone */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                    <button
                        onClick={onDelete}
                        className="w-full py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                        <Trash2 size={16} />
                        Supprimer cette personne
                    </button>
                </div>
            </div>
        </div>
    );
}

const RelationCard = ({ label, count, icon, color, onClick }: { label: string, count: number, icon: React.ReactNode, color: 'indigo' | 'emerald' | 'rose', onClick: () => void }) => (
    <div onClick={onClick} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all group">
        <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg text-white transition-colors",
                color === 'indigo' && "bg-indigo-500",
                color === 'emerald' && "bg-emerald-500",
                color === 'rose' && "bg-rose-500",
            )}>
                {icon}
            </div>
            <span className="font-semibold text-slate-700 text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-md text-xs">{count}</span>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
        </div>
    </div>
);
