import React from 'react';
import appLogoImg from '../assets/images/health_dost_logo_1787992697665.jpg';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  titleOverride?: string;
  className?: string;
}

export const AppLogoIcon: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden shadow-xs bg-white border border-slate-100 p-0.5 transition-transform ${sizeClasses[size]} ${className}`}
    >
      <img
        src={appLogoImg}
        alt="Health Dost Logo"
        className="w-full h-full object-contain rounded-[inherit]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  titleOverride,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AppLogoIcon size={size} />
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0284c7]">
              Health<span className="text-[#16a34a]">Dost</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
              AI
            </span>
          </div>
          {showTagline && (
            <p className="text-xs text-slate-500 font-medium tracking-normal mt-0.5">
              {titleOverride || 'Your Health Companion'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
