import { Award, Zap, Car, Leaf, Star, Trees } from "lucide-react";

export function BadgeGrid() {
  const badges = [
    { id: 1, name: "First Step", icon: Leaf, unlocked: true },
    { id: 2, name: "Energy Saver", icon: Zap, unlocked: true },
    { id: 3, name: "Green Ride", icon: Car, unlocked: false },
    { id: 4, name: "Eco Star", icon: Star, unlocked: false },
    { id: 5, name: "Forest Guard", icon: Trees, unlocked: false },
    { id: 6, name: "Champion", icon: Award, unlocked: false },
  ];

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">Your Badges</h2>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`flex flex-col items-center p-3 rounded-xl border ${
              badge.unlocked 
                ? "bg-primary/10 border-primary/20 text-primary" 
                : "bg-muted/50 border-border text-muted-foreground opacity-60"
            }`}
          >
            <badge.icon className="w-8 h-8 mb-2" />
            <span className="text-xs font-semibold text-center leading-tight">
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
