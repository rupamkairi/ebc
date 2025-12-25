import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { Bell, ScanLine, Settings } from "lucide-react";

interface ProfileCardProps {
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="w-full flex flex-row items-center justify-between p-4 bg-background">
      <div className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <TypographyH2 className="text-xl lg:text-2xl border-none p-0 m-0">
            {user.name}
          </TypographyH2>
          <TypographyMuted>{user.role}</TypographyMuted>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="border rounded-full p-2 hover:bg-muted cursor-pointer">
          <ScanLine className="h-5 w-5" />
        </div>
        <div className="border rounded-full p-2 hover:bg-muted cursor-pointer">
          <Settings className="h-5 w-5" />
        </div>
        <div className="border rounded-full p-2 hover:bg-muted cursor-pointer">
          <Bell className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
