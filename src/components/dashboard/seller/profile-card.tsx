import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Bell, ScanLine, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Card className="w-full flex flex-row items-center justify-between p-6 bg-white border-none shadow-sm rounded-4xl">
      <div className="flex flex-row items-center gap-5">
        <Avatar className="h-16 w-16 rounded-2xl">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-black">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-2xl font-black tracking-tight italic text-foreground">
            {user.name}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 italic">{user.role}</p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 border border-border rounded-xl flex items-center justify-center hover:bg-muted cursor-pointer transition-colors text-foreground/40">
          <ScanLine className="h-5 w-5" />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="h-10 w-10 border border-border rounded-xl flex items-center justify-center hover:bg-muted cursor-pointer transition-colors text-foreground/40">
              <Settings className="h-5 w-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border shadow-2xl">
            <DropdownMenuLabel className="font-black italic text-xs uppercase tracking-widest text-foreground/30 px-3 py-2">Account Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl font-bold italic h-10 cursor-pointer">
              Edit Business Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl font-bold italic h-10 cursor-pointer">
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="rounded-xl font-black italic h-10 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-10 w-10 border border-border rounded-xl flex items-center justify-center hover:bg-muted cursor-pointer transition-colors text-foreground/40">
          <Bell className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
