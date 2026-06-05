import { useState } from "react"
import client from "../api/client"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      await client.post("/auth/register", { username, email, password })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md border border-slate-100">

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0F172A]">InsightForge <span className="text-[#7C3AED]">AI</span></h1>
          <p className="text-slate-500 mt-2 text-sm">Create your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="mt-6 w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-[#7C3AED] font-medium cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  )
}