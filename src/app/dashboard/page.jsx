"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  UserCircle,
  Smile,
  TrendingUp,
  Calendar,
  Sparkles,
} from "lucide-react";
import DashboardNav from "@/Compunent/DashboardNav";

export default function Dashboard() {
  const [data, setData] = useState({
    moodCheckins: 0,
    conversations: 0,
    wellnessScore: "Loading...",
    userName: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();

        setData({
          moodCheckins: json.moodCheckins,
          conversations: json.conversations,
          wellnessScore: json.wellnessScore,
          userName: json.name,
        });
      } catch (err) {
        setError("Unable to load dashboard. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen text-black bg-gray-100">
      <DashboardNav />

      <main className="container max-w-5xl mx-auto px-6 py-8  ">
        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-8 mb-8 shadow-soft bg-gradient-to-r from-[#F6E7F2] via-[#EBDFF4] to-[#F3F4F6]"
          style={{ animation: "slide-up 0.5s ease-out forwards" }}
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-black mb-2">
            {loading ? "Welcome back!" : `Welcome back, ${data.userName}!`} 🌸
          </h1>
          <p className="text-black/80 text-lg">
              How are you feeling today? Remember, every step forward matters.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: Smile,
              label: "Mood Check-ins",
              value: loading ? "..." : data.moodCheckins,
            },
            {
              icon: MessageCircle,
              label: "Conversations",
              value: loading ? "..." : data.conversations,
            },
            {
              icon: TrendingUp,
              label: "Wellness Score",
              value: loading ? "..." : data.wellnessScore,
            },
          ].map((card, i) => (
            <div
              key={card.label}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
              style={{
                animation: `slide-up ${0.5 + i * 0.1}s ease-out forwards`,
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#EBDFF4] text-black flex items-center justify-center mb-4">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-black font-medium">{card.label}</p>
              <p className="text-2xl font-display font-bold text-black mt-1">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-display font-bold text-black mb-4">
          Quick Actions
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: MessageCircle,
              title: "Start a Chat",
              desc: "Talk to your AI companion about anything",
              href: "/chat",
            },
            {
              icon: UserCircle,
              title: "View Profile",
              desc: "Check your settings and preferences",
              href: "/profile",
            },
            {
              icon: Calendar,
              title: "Mood History",
              desc: "See how you've been feeling over time",
              href: "/dashboard",
            },
          ].map((action, i) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              style={{
                animation: `slide-up ${0.7 + i * 0.1}s ease-out forwards`,
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#EBDFF4] text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <action.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-black mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-black/70">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Encouraging Message */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-black/70">
            <Sparkles className="h-4 w-4 text-black" />
            <span className="text-sm italic">
              "You're doing great. One day at a time."
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}