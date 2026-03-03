"use client";
import { useState, useEffect } from "react";
import DashboardNav from "@/Compunent/DashboardNav";
import { Button } from "@/Compunent/ui/button"; 
import { UserCircle, Mail, Bell, Shield, Palette } from "lucide-react";

const Profile = () => {
  const [displayName, setDisplayName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex@example.com");
  const [prefs, setPrefs] = useState({
    dailyReminders: true,
    privacyMode: true,
    calmingAnimations: true,
  });

  // ✅ Load logged-in user data from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedName) setDisplayName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alert(`Saved! Display Name: ${displayName}`);
    // Optionally save updated name/email to localStorage
    localStorage.setItem("username", displayName);
    localStorage.setItem("userEmail", email);
  };

  const handleDownload = () => {
    const userData = { displayName, email, prefs };
    const blob = new Blob([JSON.stringify(userData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${displayName.replace(" ", "_")}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      setDisplayName("");
      setEmail("");
      setPrefs({
        dailyReminders: false,
        privacyMode: false,
        calmingAnimations: false,
      });
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");
      alert("Account deleted.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <DashboardNav />

      <main className="container max-w-2xl mx-auto px-6 py-8 space-y-8">
        <h1
          className="text-2xl font-bold"
          style={{ animation: "slide-up 0.4s ease-out forwards" }}
        >
          Your Profile
        </h1>

        {/* User Info Card */}
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-300 p-8"
          style={{ animation: "slide-up 0.5s ease-out forwards" }}
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-gray-700" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{displayName || "No Name"}</h2>
              <p className="text-sm text-gray-600">{email || "No Email"}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-gray-100 text-black"
                />
              </div>
            </div>

            <Button variant="default" className="mt-2" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Preferences */}
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-300 p-8"
          style={{ animation: "slide-up 0.6s ease-out forwards" }}
        >
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Palette className="h-5 w-5 text-black" />
            Preferences
          </h2>

          <div className="space-y-6">
            {[
              {
                key: "dailyReminders",
                icon: Bell,
                label: "Daily wellness reminders",
                desc: "Get gentle nudges to check in with yourself",
              },
              {
                key: "privacyMode",
                icon: Shield,
                label: "Enhanced privacy mode",
                desc: "Extra layers of data protection",
              },
              {
                key: "calmingAnimations",
                icon: Palette,
                label: "Calming animations",
                desc: "Enable soothing micro-animations",
              },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mt-0.5">
                    <pref.icon className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="font-medium text-black text-sm">{pref.label}</p>
                    <p className="text-xs text-gray-600">{pref.desc}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs[pref.key]}
                  onChange={() => togglePref(pref.key)}
                  className="h-5 w-5 text-black rounded border-gray-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Safety */}
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-300 p-8"
          style={{ animation: "slide-up 0.7s ease-out forwards" }}
        >
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-black" />
            Privacy & Safety
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Your privacy is our top priority. All conversations are encrypted and never shared with third parties. You can delete your data at any time.
          </p>
          <div className="flex gap-3">
            <Button
              variant="default"
              size="sm"
              className="rounded-xl bg-black text-white hover:bg-gray-800"
              onClick={handleDownload}
            >
              Download My Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border border-red-500 text-red-600 hover:bg-red-100"
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;