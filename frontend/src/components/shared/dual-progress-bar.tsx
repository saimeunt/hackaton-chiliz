interface DualProgressBarProps {
  homeTeam: {
    color: string;
  };
  awayTeam: {
    color: string;
  };
  homePercentage: number;
  awayPercentage: number;
}

export function DualProgressBar({
  homeTeam,
  awayTeam,
  homePercentage,
  awayPercentage,
}: DualProgressBarProps) {
  return (
    <div className="space-y-3">
      {/* Progress bar style shadcn avec deux couleurs vives */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        {/* Partie home team (gauche) */}
        <div
          className={`absolute top-0 left-0 h-full ${homeTeam.color} transition-all duration-500 ease-in-out`}
          style={{ width: `${homePercentage}%` }}
        />

        {/* Partie away team (droite) */}
        <div
          className={`absolute top-0 right-0 h-full ${awayTeam.color} transition-all duration-500 ease-in-out`}
          style={{ width: `${awayPercentage}%` }}
        />
      </div>

      {/* Pourcentages en dessous */}
      <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
        <span>{homePercentage}%</span>
        <span>{awayPercentage}%</span>
      </div>
    </div>
  );
}
