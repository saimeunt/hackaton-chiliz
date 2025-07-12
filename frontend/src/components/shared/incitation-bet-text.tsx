interface IncitationBetTextProps {
  homePercentage: number;
  awayPercentage: number;
  homeTeam: string;
  awayTeam: string;
}

const messages = {
  // 0-10% difference - very tight
  neck_to_neck: [
    "It's neck and neck! This match is too close to call! 🔥",
    'What a battle! The fans are split right down the middle! ⚡',
    "This is anyone's game! The community can't decide! 🎯",
    'Split decision! The tension is real! 💥',
    'Dead heat! Every vote counts now! 🚀',
  ],

  // 11-20% difference - slight domination
  slight_lead: [
    '{leader} fans are pulling ahead, but {trailing} supporters are fighting back! 💪',
    "{leader} taking the lead, but {trailing} isn't giving up! 🏃‍♂️",
    'Close race! {leader} fans have a slight edge over {trailing}! 📈',
    '{leader} supporters are gaining momentum, but {trailing} is still in this! 🔥',
    "It's heating up! {leader} fans are pushing forward! 🚀",
  ],

  // 21-35% difference - domination
  dominating: [
    '{leader} fans are dominating! {trailing} supporters need to rally! 🚀',
    '{leader} is taking control! {trailing} fans, time to step up! 💪',
    'The {leader} army is marching! {trailing} needs backup! 🏰',
    '{leader} supporters are on fire! {trailing} fans, where are you? 🔥',
    'Strong showing from {leader}! {trailing} needs a comeback! 📊',
  ],

  // 36-50% difference - crushing
  crushing: [
    '{leader} fans are absolutely crushing it! {trailing} supporters getting obliterated! 💥',
    'Total domination by {leader}! {trailing} fans are nowhere to be seen! 🌪️',
    '{leader} is steamrolling! {trailing} supporters need a miracle! ⚡',
    'Massacre! {leader} fans are destroying the competition! 🔥',
    '{leader} army is unstoppable! {trailing} in complete meltdown! 💀',
  ],
};

export function IncitationBetText({
  homePercentage,
  awayPercentage,
  homeTeam,
  awayTeam,
}: IncitationBetTextProps) {
  const difference = Math.abs(homePercentage - awayPercentage);
  const leader = homePercentage > awayPercentage ? homeTeam : awayTeam;
  const trailing = homePercentage > awayPercentage ? awayTeam : homeTeam;

  let messageArray: string[];

  if (difference <= 10) {
    messageArray = messages.neck_to_neck;
  } else if (difference <= 20) {
    messageArray = messages.slight_lead;
  } else if (difference <= 35) {
    messageArray = messages.dominating;
  } else {
    messageArray = messages.crushing;
  }

  // Random message selection
  const randomIndex = Math.floor(Math.random() * messageArray.length);
  const message = messageArray[randomIndex]
    .replace('{leader}', leader)
    .replace('{trailing}', trailing);

  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
      <p className="text-sm text-purple-700 dark:text-purple-300 font-medium text-center">
        {message}
      </p>
    </div>
  );
}
