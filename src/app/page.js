"use client";
import Link from "next/link";
import { Heart, Shield, MessageCircle, Sparkles, Lock, Users } from "lucide-react";
import { Button } from "../Compunent/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/10">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-purple-600" />
            <span className="font-display font-bold text-xl text-black">
              SOLACE
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-r from-[#F6E7F2] via-[#EBDFF4] to-[#F3F4F6] overflow-hidden">
        <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#EBDFF4] text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Your safe space for wellness
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              You deserve to feel{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                heard & supported
              </span>
            </h1>

            <p className="text-lg text-black/70 max-w-lg leading-relaxed">
              A warm, judgment-free companion that listens, understands, and helps
              you grow — at your own pace.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50" asChild>
                <Link href="/login">I have an account</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-purple-200/40 rounded-full blur-3xl" />
            <img
              src="/hero-illustration-ggYXG3FN.png"
              alt="Meditation illustration"
              className="relative w-full max-w-md rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Built for your comfort
            </h2>
            <p className="text-black/70 text-lg max-w-2xl mx-auto">
              Every detail is designed to make you feel safe and understood.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Safe & Private",
                desc: "Your conversations are private and protected.",
              },
              {
                icon: MessageCircle,
                title: "AI Wellness Companion",
                desc: "Talk freely with empathy and care.",
              },
              {
                icon: Users,
                title: "Built for Shy Users",
                desc: "No pressure. Move at your own pace.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl p-8 border border-black/10 shadow-sm hover:shadow-md transition bg-gradient-to-b from-white to-[#FAF7FD]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EBDFF4] text-purple-700 flex items-center justify-center mb-5">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-black/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#F3F4F6] to-[#EBDFF4]">
        <div className="container max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <img
            src="/support-illustration-ZltcFJkx.png"
            alt="Support conversation"
            className="w-full max-w-sm mx-auto rounded-2xl shadow-md"
          />

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Talk freely, without fear
            </h2>
            <p className="text-black/70 text-lg">
              Express yourself safely in a warm, supportive space.
            </p>

            <div className="space-y-4">
              {[
                { icon: Lock, text: "End-to-end privacy protection" },
                { icon: Heart, text: "Empathetic responses" },
                { icon: Sparkles, text: "Personalized wellness insights" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EBDFF4] text-purple-700 flex items-center justify-center">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <Link href="/signup">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </section>
      <div className="container max-w-5xl mx-auto px-6 py-8 text-center text-black">
        <h2 className="text-2xl font-bold mb-4">Ready to feel heard?</h2>
        <p className="text-lg text-black/70 mb-6">
          Join Solace today and start your journey to wellness.
        </p>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
          <Link href="/signup">Get Started Free</Link>
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 py-12 px-6 bg-white">
        <div className="container max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-600" />
            <span className="font-bold">Solace</span>
          </div>

          <p className="text-sm text-black/60">
            © 2026 Solace. Your safe space for wellness.
          </p>

          <div className="flex gap-6 text-sm text-black/60">
            <span className="hover:text-purple-600 cursor-pointer">Privacy</span>
            <span className="hover:text-purple-600 cursor-pointer">Terms</span>
            <span className="hover:text-purple-600 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}