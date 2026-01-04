"use client";

import { 
  Settings, 
  Bell, 
  Lock, 
  Languages, 
  Smartphone, 
  Moon, 
  ChevronRight,
  ShieldCheck,
  Zap,
  LogOut
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const settingGroups = [
  {
    title: "Notifications",
    icon: Bell,
    className: "text-blue-500 bg-blue-50",
    items: [
      { id: "notif-1", label: "New Lead Alerts", desc: "Get notified when a buyer sends an inquiry.", active: true },
      { id: "notif-2", label: "Quotation Updates", desc: "Know when a quote is accepted or rejected.", active: true },
      { id: "notif-3", label: "Marketing Tips", desc: "Receive tips to grow your business.", active: false },
    ]
  },
  {
    title: "Preferences",
    icon: Zap,
    className: "text-amber-500 bg-amber-50",
    items: [
      { id: "pref-1", label: "Hinglish Mode", desc: "Show dashboard text in a mix of Hindi and English.", active: true },
      { id: "pref-2", label: "Auto-respond to inquiries", desc: "Send a welcome message automatically.", active: false },
    ]
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-foreground tracking-tight">Settings</h1>
            <p className="text-foreground/60 font-medium">Control your dashboard experience and security.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {settingGroups.map((group, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className={`p-2 rounded-xl ${group.className}`}>
                      <group.icon size={20} />
                    </div>
                    <h2 className="text-xl font-black text-foreground">{group.title}</h2>
                  </div>
                  
                  <Card className="border-none shadow-sm">
                    <CardContent className="p-0">
                      {group.items.map((item, idx) => (
                        <div key={item.id} className={`p-6 flex items-center justify-between gap-6 ${
                          idx !== group.items.length - 1 ? 'border-b border-border' : ''
                        }`}>
                          <div className="space-y-1">
                            <h4 className="font-bold text-foreground">{item.label}</h4>
                            <p className="text-xs font-medium text-foreground/40 italic">{item.desc}</p>
                          </div>
                          <Switch defaultChecked={item.active} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ))}

              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="p-2 rounded-xl text-emerald-500 bg-emerald-50">
                    <Lock size={20} />
                  </div>
                  <h2 className="text-xl font-black text-foreground">Security</h2>
                </div>
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <button className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors text-left border-b border-border">
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground">Change Password</h4>
                        <p className="text-xs font-medium text-foreground/40 italic">Update your login security regularly.</p>
                      </div>
                      <ChevronRight size={18} className="text-foreground/20" />
                    </button>
                    <button className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors text-left">
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground">Login Session Management</h4>
                        <p className="text-xs font-medium text-foreground/40 italic">See all devices logged into your account.</p>
                      </div>
                      <ChevronRight size={18} className="text-foreground/20" />
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-8">
              <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative group">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-50" />
                <CardContent className="p-8 space-y-6 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck size={28} className="text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black italic">Account Status</h3>
                    <p className="text-sm font-medium text-white/50 leading-relaxed">Your account is fully verified and compliant with EBC seller policies.</p>
                  </div>
                  <div className="pt-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Premium Business Account
                     </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                 <Button variant="outline" className="w-full h-14 border-border rounded-2xl font-bold bg-white text-rose-500 hover:bg-rose-50 hover:border-rose-100 flex items-center justify-center gap-3">
                    <LogOut size={20} />
                    Log Out of Account
                 </Button>
                 <p className="text-[10px] font-bold text-center text-foreground/20 italic uppercase tracking-widest">Version 1.0.4-Beta • EBC Team</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
