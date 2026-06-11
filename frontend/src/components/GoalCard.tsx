import { Card, CardContent } from "@/components/ui/card";

export function GoalCard({ goal, onToggle }: { goal: { id: string, status: string, target_co2e: number, current_co2e?: number, category: string, deadline: string }, onToggle: (id: string, completed: boolean) => void }) {
  const isCompleted = goal.status === "completed";
  const progress = isCompleted ? 100 : Math.min(100, Math.max(0, (goal.current_co2e || 0) / goal.target_co2e * 100));

  return (
    <Card className={`shadow-sm mb-3 transition-colors ${isCompleted ? 'bg-green-50/50 dark:bg-green-900/20' : 'bg-card'}`}>
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-bold text-lg ${isCompleted ? 'text-green-800 line-through opacity-70' : 'text-foreground'}`}>
              Save {goal.target_co2e} kg CO₂e
            </h3>
            <p className="text-sm text-muted-foreground capitalize">Category: {goal.category} • Due: {new Date(goal.deadline).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
                onClick={() => onToggle(goal.id, !isCompleted)}
                className={`text-xs font-semibold px-2 py-1 rounded-full border ${isCompleted ? 'bg-green-100 text-green-700 border-green-300' : 'bg-muted text-muted-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20'}`}
            >
                {isCompleted ? 'Completed' : 'Mark Done'}
            </button>
          </div>
        </div>

        <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Progress</span>
                <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
