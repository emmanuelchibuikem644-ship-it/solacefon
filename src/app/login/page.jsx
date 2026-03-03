// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Heart, Mail, Lock } from "lucide-react";

// export default function Login() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [remember, setRemember] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const API_BASE = "https://solace-2.onrender.com"; // Deployed backend

//   // Redirect if already logged in
//  useEffect(() => {
//   const token = localStorage.getItem("access");
//   if (token) {
//     // ✅ Only redirect if current route is login
//     if (window.location.pathname === "/login") {
//       router.replace("/dashboard");
//     }
//   }
// }, [router]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     if (!email.trim()) newErrors.email = "Please enter your email";
//     if (!password.trim()) newErrors.password = "Please enter your password";
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/auth/login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: email, // Login with email as username
//           password: password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setErrors({ form: data.detail || "Invalid email or password" });
//         setLoading(false);
//         return;
//       }

//       // Save JWT tokens
//       localStorage.setItem("access", data.access);
//       localStorage.setItem("refresh", data.refresh);
//       localStorage.setItem("username", data.user.username);
//       localStorage.setItem("email", data.user.email);

//       router.push("/dashboard");
//     } catch (error) {
//       setErrors({ form: "Network error. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white text-black">
//       <div className="w-full max-w-md" style={{ animation: "slide-up 0.5s ease-out forwards" }}>
//         {/* Header */}
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-flex items-center gap-2 mb-6">
//             <Heart className="h-7 w-7 text-black" />
//             <span className="font-display font-bold text-2xl text-black">Solace</span>
//           </Link>
//           <h1 className="text-2xl font-display font-bold text-black">Welcome back</h1>
//           <p className="mt-1 text-black">We're glad you're here 💜</p>
//         </div>

//         {/* Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-8">
//           {errors.form && <p className="text-red-500 mb-4">{errors.form}</p>}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-black">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//                 <input
//                   type="email"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10 w-full rounded-xl border border-gray-300 p-2 text-black placeholder-gray-400"
//                 />
//               </div>
//               {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-black">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//                 <input
//                   type="password"
//                   placeholder="Your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-10 w-full rounded-xl border border-gray-300 p-2 text-black placeholder-gray-400"
//                 />
//               </div>
//               {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
//             </div>

//             {/* Remember */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={remember}
//                 onChange={(e) => setRemember(e.target.checked)}
//                 className="h-4 w-4 rounded border-gray-500"
//               />
//               <label className="text-sm cursor-pointer text-black">Remember me</label>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-black text-white py-2 rounded-xl font-bold hover:bg-gray-800 transition"
//             >
//               {loading ? "Logging in..." : "Log in"}
//             </button>
//           </form>
//         </div>

//         <p className="text-center text-sm mt-6 text-black">
//           Don't have an account?{" "}
//           <Link href="/signup" className="text-black font-semibold hover:underline">
//             Sign up free
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }