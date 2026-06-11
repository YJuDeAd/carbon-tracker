import { Award, Zap, Car, Leaf, Star, Trees } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function BadgeGrid({ unlockedBadges = [] }: { unlockedBadges?: string[] }) {
  const badges = [
    { id: 1, name: "First Step", icon: Leaf, description: "Log your first activity" },
    { id: 2, name: "Energy Saver", icon: Zap, description: "Log an Energy activity" },
    { id: 3, name: "Green Ride", icon: Car, description: "Log a Transport activity" },
    { id: 4, name: "Eco Star", icon: Star, description: "Achieve a 3-day streak" },
    { id: 5, name: "Forest Guard", icon: Trees, description: "Log 5 total activities" },
    { id: 6, name: "Champion", icon: Award, description: "Log 10 total activities" },
  ];

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">Your Badges</h2>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.name);
          return (
            <Popover key={badge.id}>
              <PopoverTrigger
                className={`flex flex-col items-center p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors ${
                  isUnlocked 
                    ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" 
                    : "bg-muted/50 border-border text-muted-foreground opacity-60 hover:opacity-80"
                }`}
              >
                <badge.icon className="w-8 h-8 mb-2" />
                <span className="text-xs font-semibold text-center leading-tight">
                  {badge.name}
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 text-center space-y-2">
                <div className="flex justify-center">
                  <div className={`p-2 rounded-full ${isUnlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <badge.icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{badge.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                </div>
                <div className="pt-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isUnlocked ? 'bg-green-100 text-green-700' : 'bg-secondary text-secondary-foreground'}`}>
                    {isUnlocked ? 'Unlocked!' : 'Locked'}
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </section>
  );
}
