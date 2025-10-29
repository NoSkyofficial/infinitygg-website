import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ 
  icon: Icon, 
  title, 
  description, 
  actions 
}: AdminHeaderProps) {
  return (
    <div className="relative mb-8">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#26a69a]/10 via-transparent to-transparent rounded-2xl blur-3xl" />
      
      {/* Content */}
      <div className="relative bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#26a69a] to-[#00897b] rounded-2xl blur-xl opacity-50" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#26a69a] to-[#00897b] rounded-2xl flex items-center justify-center shadow-lg">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                {title}
                <div className="h-8 w-1 bg-gradient-to-b from-[#26a69a] to-transparent rounded-full" />
              </h1>
              <p className="text-gray-400 text-lg">{description}</p>
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>

        {/* Decorative Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#26a69a]/50 to-transparent" />
      </div>
    </div>
  );
}