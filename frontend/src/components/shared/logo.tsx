interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = 'md',
  iconSize,
  textSize,
  showText = true,
  className = '',
}: LogoProps) {
  // Utiliser iconSize et textSize si définis, sinon utiliser size par défaut
  const effectiveIconSize = iconSize || size;
  const effectiveTextSize = textSize || size;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Coin with smiley face */}
      <div className={`${sizeClasses[effectiveIconSize]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg"></div>

        {/* Inner coin */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">
          {/* Smiley face */}
          <div className="text-amber-800 font-bold relative">
            {/* Eyes */}
            <div className="flex justify-center gap-1 mb-1">
              <div
                className={`bg-amber-800 rounded-full ${effectiveIconSize === 'sm' ? 'w-1 h-1' : effectiveIconSize === 'md' ? 'w-1.5 h-1.5' : effectiveIconSize === 'lg' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
              ></div>
              <div
                className={`bg-amber-800 rounded-full ${effectiveIconSize === 'sm' ? 'w-1 h-1' : effectiveIconSize === 'md' ? 'w-1.5 h-1.5' : effectiveIconSize === 'lg' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}
              ></div>
            </div>

            {/* Smile */}
            <div
              className={`border-b-2 border-amber-800 rounded-full ${effectiveIconSize === 'sm' ? 'w-3 h-1' : effectiveIconSize === 'md' ? 'w-4 h-1.5' : effectiveIconSize === 'lg' ? 'w-5 h-2' : 'w-6 h-2.5'}`}
            ></div>
          </div>
        </div>

        {/* Shine effect */}
        <div
          className={`absolute rounded-full bg-white/40 ${effectiveIconSize === 'sm' ? 'top-1 left-1 w-1.5 h-1.5' : effectiveIconSize === 'md' ? 'top-1.5 left-1.5 w-2 h-2' : effectiveIconSize === 'lg' ? 'top-2 left-2 w-3 h-3' : 'top-3 left-3 w-4 h-4'}`}
        ></div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-bold text-almost-black dark:text-white ${textSizeClasses[effectiveTextSize]}`}
          >
            Clash of FanZ
          </span>
        </div>
      )}
    </div>
  );
}
