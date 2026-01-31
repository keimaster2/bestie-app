"use client";

import React from 'react';

type PanelHeaderProps = {
    icon: React.ReactNode;
    title: string;
    rightElement?: React.ReactNode;
};

export function PanelHeader({ icon, title, rightElement }: PanelHeaderProps) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2">
                <span className="text-lg opacity-80">
                    {icon}
                </span>
                <h2 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-90">
                    {title}
                </h2>
            </div>
            {rightElement && (
                <div className="flex items-center gap-1.5">
                    {rightElement}
                </div>
            )}
        </div>
    );
}
