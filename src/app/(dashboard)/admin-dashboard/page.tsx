"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  Store,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  MoreVertical,
  Activity,
  ShoppingBag,
  Bell,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: Wallet,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "New Sellers",
    value: "+12,234",
    change: "+19%",
    trend: "up",
    icon: Store,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Active Listings",
    value: "573",
    change: "-201",
    trend: "down",
    icon: ShoppingBag,
    color: "bg-orange-500/10 text-orange-500",
  },
];

const recentActivity = [
  {
    user: "Alex Thompson",
    action: "registered as a new seller",
    time: "2 minutes ago",
    avatar: "AT",
    color: "bg-blue-100 text-blue-600",
  },
  {
    user: "Sarah Chen",
    action: "updated 15 brand specifications",
    time: "45 minutes ago",
    avatar: "SC",
    color: "bg-green-100 text-green-600",
  },
  {
    user: "Mike Ross",
    action: "approved 3 new product categories",
    time: "1 hour ago",
    avatar: "MR",
    color: "bg-purple-100 text-purple-600",
  },
  {
    user: "Emma Wilson",
    action: "reported a system performance issue",
    time: "3 hours ago",
    avatar: "EW",
    color: "bg-rose-100 text-rose-600",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Welcome back, <span className="text-blue-400">Admin</span>
          </h1>
          <p className="mb-8 text-lg text-slate-300">
            Monitor your marketplace performance, manage users, and keep track
            of your business growth in real-time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Manager
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800"
            >
              <Activity className="mr-2 h-4 w-4" /> View Analytics
            </Button>
          </div>
        </div>

        {/* Abstract Background Image */}
        <div className="absolute right-0 top-0 hidden h-full w-1/3 lg:block">
          <Image
            src="/images/dashboard-hero.png"
            alt="Dashboard"
            width={600}
            height={600}
            className="h-full w-full object-cover mix-blend-screen opacity-80 transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900" />
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-none shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-xl p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 flex items-center text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-emerald-500" : "text-rose-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-muted-foreground text-[10px] uppercase font-semibold">
                  from last month
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Main Chart Placeholder */}
        <Card className="lg:col-span-4 border-none shadow-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monthly sales and growth indicators
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-400 font-medium font-sans">
                  Interactive Chart Integration Coming Soon
                </p>
                <div className="mt-6 flex items-end gap-2 justify-center">
                  {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95].map((h, i) => (
                    <div
                      key={i}
                      className={`w-6 rounded-t-lg transition-all duration-500 hover:brightness-110 ${
                        i % 2 === 0 ? "bg-blue-500/30" : "bg-purple-500/30"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed & Health */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest events across the platform
                </p>
              </div>
              <Bell className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-4 transition-all hover:translate-x-1"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold shadow-sm transition-transform group-hover:scale-110 ${item.color}`}
                    >
                      {item.avatar}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.user}{" "}
                        <span className="font-normal text-muted-foreground">
                          {item.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full mt-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                >
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Health Mini-Card */}
          <Card className="border-none shadow-md bg-linear-to-br from-slate-900 to-slate-800 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      System Health
                    </p>
                    <p className="text-sm font-bold">Operational</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-4 w-1 bg-emerald-500 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
