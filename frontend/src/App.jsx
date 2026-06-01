import { useEffect, useState } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Threats from "./pages/Threats"
import Incidents from "./pages/Incidents"
import Analytics from "./pages/Analytics"
import AIAssistant from "./pages/AIAssistant"

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activePage, setActivePage] = useState("dashboard")
  const [alerts, setAlerts] = useState([])

  useEffect(() => {

    if (!isAuthenticated) {
      return
    }

    const fetchAlerts = async () => {

      try {

        const response = await fetch("http://127.0.0.1:5000/alerts")

        const data = await response.json()

        setAlerts(data)

      } catch (error) {

        console.log("Failed to fetch alerts")

      }

    }

    fetchAlerts()

    const interval = setInterval(() => {
      fetchAlerts()
    }, 3000)

    return () => clearInterval(interval)

  }, [isAuthenticated])

  if (!isAuthenticated) {

    return <Login setIsAuthenticated={setIsAuthenticated} />

  }

  return (
    <div className="min-h-screen bg-black text-white flex">

      <aside className="w-64 bg-black border-r border-green-500/20 p-6">

        <h1 className="text-3xl font-bold text-green-400 mb-10">
          SecureShield
        </h1>

        <div className="space-y-4">

          <button
            onClick={() => setActivePage("dashboard")}
            className={`px-4 py-3 rounded-lg w-full text-left ${
              activePage === "dashboard"
                ? "bg-green-900 text-green-400"
                : "text-white hover:bg-[#111827]"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActivePage("threats")}
            className={`px-4 py-3 rounded-lg w-full text-left ${
              activePage === "threats"
                ? "bg-green-900 text-green-400"
                : "text-white hover:bg-[#111827]"
            }`}
          >
            Threats
          </button>

          <button
            onClick={() => setActivePage("incidents")}
            className={`px-4 py-3 rounded-lg w-full text-left ${
              activePage === "incidents"
                ? "bg-green-900 text-green-400"
                : "text-white hover:bg-[#111827]"
            }`}
          >
            Incidents
          </button>

          <button
            onClick={() => setActivePage("analytics")}
            className={`px-4 py-3 rounded-lg w-full text-left ${
              activePage === "analytics"
                ? "bg-green-900 text-green-400"
                : "text-white hover:bg-[#111827]"
            }`}
          >
            Analytics
          </button>

          <button
            onClick={() => setActivePage("ai")}
            className={`px-4 py-3 rounded-lg w-full text-left ${
              activePage === "ai"
                ? "bg-green-900 text-green-400"
                : "text-white hover:bg-[#111827]"
            }`}
          >
            AI Assistant
          </button>

        </div>
      </aside>

      <main className="flex-1">

        {activePage === "dashboard" && (
          <Dashboard alerts={alerts} setIsAuthenticated={setIsAuthenticated} />
        )}

        {activePage === "threats" && (
          <Threats alerts={alerts} />
        )}

        {activePage === "incidents" && (
          <Incidents alerts={alerts} />
        )}

        {activePage === "analytics" && (
          <Analytics alerts={alerts} />
        )}

        {activePage === "ai" && (
          <AIAssistant alerts={alerts} />
        )}

      </main>

    </div>
  )
}

export default App