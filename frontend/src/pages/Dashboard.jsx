import { useState, useEffect } from "react"
import client from "../api/client"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await client.get("/datasets")
        setDatasets(res.data)
      } catch (err) {
        if (err.response?.status === 401) navigate("/")
      } finally {
        setLoading(false)
      }
    }
    fetchDatasets()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-[#0F172A]">InsightForge <span className="text-[#7C3AED]">AI</span></h1>
        <div className="flex items-center gap-6">
          <span onClick={() => navigate("/upload")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Upload</span>
          <span onClick={() => navigate("/predict")} className="text-sm text-slate-600 hover:text-[#7C3AED] cursor-pointer font-medium transition">Predict</span>
          <button onClick={handleLogout} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A]">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Overview of your uploaded datasets</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Total Datasets</p>
            <p className="text-3xl font-bold text-[#0F172A] mt-1">{datasets.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Total Rows Processed</p>
            <p className="text-3xl font-bold text-[#7C3AED] mt-1">
              {datasets.reduce((acc, d) => acc + (d.rows_count || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Avg Columns</p>
            <p className="text-3xl font-bold text-[#0F172A] mt-1">
              {datasets.length ? Math.round(datasets.reduce((acc, d) => acc + (d.columns_count || 0), 0) / datasets.length) : 0}
            </p>
          </div>
        </div>

        {/* Datasets Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-[#0F172A]">Recent Uploads</h3>
          </div>
          {loading ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">Loading...</div>
          ) : datasets.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">No datasets uploaded yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Filename</th>
                  <th className="px-6 py-3 text-left">Rows</th>
                  <th className="px-6 py-3 text-left">Columns</th>
                  <th className="px-6 py-3 text-left">Uploaded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {datasets.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-[#0F172A]">{d.filename}</td>
                    <td className="px-6 py-4 text-slate-600">{d.rows_count}</td>
                    <td className="px-6 py-4 text-slate-600">{d.columns_count}</td>
                    <td className="px-6 py-4 text-slate-500">{d.uploaded_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}