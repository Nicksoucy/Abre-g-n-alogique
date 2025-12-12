import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { Person } from '../types';
import clsx from 'clsx';
import { getGenColor, getGenLabel } from '../utils/styling';

const PersonNode = ({ data, selected }: NodeProps<{ label: string, person: Person, generation: number }>) => {
    const colorClass = getGenColor(data.generation).replace(" text-white", ""); // Extract bg only for strip/avatar
    const genLabel = getGenLabel(data.generation);
    const initials = data.person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className={clsx(
            "w-[260px] rounded-xl shadow-md border-0 transition-all duration-300 overflow-hidden bg-white group hover:shadow-xl hover:-translate-y-1 hover:z-50 relative",
            selected ? "ring-2 ring-indigo-500 shadow-indigo-200" : "hover:ring-1 hover:ring-slate-300"
        )}>

            {/* Top Banner with Generation Color */}
            <div className={clsx("h-2 w-full", colorClass)}></div>

            <div className="p-4 flex items-center gap-3">
                <Handle type="source" position={Position.Top} className="!bg-slate-300 !w-2 !h-2 border-0 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Avatar Placeholder */}
                <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0", colorClass)}>
                    {initials}
                </div>

                <div className="flex flex-col min-w-0">
                    {/* Name */}
                    <h3 className="text-sm font-bold text-slate-800 leading-tight truncate w-full" title={data.person.name}>
                        {data.person.name}
                    </h3>

                    {/* Dates */}
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {data.person.raw_dates || "Dates inconnues"}
                    </p>

                    {/* Generation Label Tag */}
                    {genLabel && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold text-slate-400">
                            {genLabel}
                        </span>
                    )}
                </div>

                <Handle type="target" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 border-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
};

export default memo(PersonNode);
