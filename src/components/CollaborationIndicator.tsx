import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, Circle } from "lucide-react";

interface Collaborator {
  name: string;
  initials: string;
  color: string;
  status: "editing" | "viewing";
  cursor?: { line: number };
}

const mockCollaborators: Collaborator[] = [
  { name: "Ama Kofi", initials: "AK", color: "bg-emerald-500", status: "editing", cursor: { line: 42 } },
  { name: "Kwesi B.", initials: "KB", color: "bg-blue-500", status: "viewing" },
  { name: "Abena M.", initials: "AM", color: "bg-purple-500", status: "viewing" },
];

const CollaborationIndicator = () => {
  const editingCount = mockCollaborators.filter((c) => c.status === "editing").length;
  const viewingCount = mockCollaborators.filter((c) => c.status === "viewing").length;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="font-medium">{mockCollaborators.length} online</span>
      </div>

      <div className="flex -space-x-2">
        {mockCollaborators.map((collab) => (
          <Tooltip key={collab.name}>
            <TooltipTrigger>
              <div className="relative">
                <Avatar className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className={`${collab.color} text-white text-[10px]`}>
                    {collab.initials}
                  </AvatarFallback>
                </Avatar>
                <Circle
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-current ${
                    collab.status === "editing" ? "text-emerald-500" : "text-blue-400"
                  }`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{collab.name}</p>
              <p className="text-xs text-muted-foreground">
                {collab.status === "editing"
                  ? `Editing at line ${collab.cursor?.line}`
                  : "Viewing"}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex gap-2 ml-auto text-xs">
        <Badge variant="outline" className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-200">
          <Circle className="h-1.5 w-1.5 fill-current" />
          {editingCount} editing
        </Badge>
        <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-200">
          <Circle className="h-1.5 w-1.5 fill-current" />
          {viewingCount} viewing
        </Badge>
      </div>
    </div>
  );
};

export default CollaborationIndicator;
