import { X, BookOpen, ScrollText } from 'lucide-react';
import { familyStories } from '../data/stories';

interface StoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StoryPanel({ isOpen, onClose }: StoryPanelProps) {
    return (
        <div
            className={`fixed left-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            {/* Header */}
            <div className="h-24 bg-gradient-to-r from-indigo-50 to-slate-50 flex items-center px-6 shrink-0 relative border-b border-indigo-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">
                        L'Histoire<br />
                        <span className="text-sm font-normal text-slate-500">des Familles</span>
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="prose prose-slate prose-sm max-w-none">
                    <p className="lead text-slate-600 italic border-l-4 border-indigo-300 pl-4 py-2 bg-slate-50 rounded-r-lg">
                        {familyStories.title}
                    </p>

                    {familyStories.sections.map((section, index) => (
                        <div key={index} className="mb-8 last:mb-0">
                            <h3 className="flex items-center gap-2 text-indigo-900 font-bold text-lg mb-3 mt-6 border-b border-slate-100 pb-2">
                                <ScrollText size={16} className="text-indigo-400" />
                                {section.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="pt-8 mt-8 border-t border-slate-100 text-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Généalogie Soucy-Legault</span>
                </div>
            </div>
        </div>
    );
}
