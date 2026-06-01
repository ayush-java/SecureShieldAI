import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

function Dashboard({ alerts = [], setIsAuthenticated }) {

  const sqlCount = alerts.filter(
    (alert) => alert.type === "SQL Injection Attempt"
  ).length

  const xssCount = alerts.filter(
    (alert) => alert.type === "XSS Attempt"
  ).length

  const bruteForceCount = alerts.filter(
    (alert) => alert.type === "Brute Force Attack"
  ).length

  const attackCounts = {}

  alerts.forEach((alert) => {
    const time = alert.timestamp.slice(11, 16)

    attackCounts[time] = (attackCounts[time] || 0) + 1
  })

  const attackTimeline = Object.keys(attackCounts).map((time) => ({
    time,
    attacks: attackCounts[time],
  }))

  return (
    <div className="flex-1 p-8 bg-[#020617] text-white">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              SOC Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Real-Time Threat Monitoring
            </p>

          </div>

          <div className="flex gap-3">
            <div className="bg-green-900 text-green-400 px-4 py-2 rounded-lg">
              System Secure
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                setIsAuthenticated(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
            >
              Logout
            </button>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white/5 border border-green-500/10 rounded-2xl p-6">

            <h2 className="text-gray-400 mb-2">
              Total Alerts
            </h2>

            <p className="text-4xl font-bold text-red-400">
              {alerts.length}
            </p>

          </div>

          <div className="bg-white/5 border border-green-500/10 rounded-2xl p-6">

            <h2 className="text-gray-400 mb-2">
              Blocked IPs
            </h2>

            <p className="text-4xl font-bold text-green-400">
              {bruteForceCount}
            </p>

          </div>

          <div className="bg-white/5 border border-green-500/10 rounded-2xl p-6">

            <h2 className="text-gray-400 mb-2">
              SQLi Attempts
            </h2>

            <p className="text-4xl font-bold text-yellow-400">
              {sqlCount}
            </p>

          </div>

          <div className="bg-white/5 border border-green-500/10 rounded-2xl p-6">

            <h2 className="text-gray-400 mb-2">
              XSS Detections
            </h2>

            <p className="text-4xl font-bold text-blue-400">
              {xssCount}
            </p>

          </div>

        </div>

        {/* Live Threat Feed */}
        <div className="bg-white/5 border border-green-500/10 rounded-2xl p-6">

          <div className="bg-[#0f172a] p-6 rounded-xl border border-green-500 mb-6">
            <h2 className="text-green-400 text-xl font-bold mb-4">
              Attack Timeline
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attackTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                <XAxis dataKey="time" stroke="#22c55e" />

                <YAxis stroke="#22c55e" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="attacks"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-green-400">
            Live Threat Feed
          </h2>

          <div className="space-y-4">

            {alerts.length === 0 ? (

              <div className="text-gray-400">
                No alerts detected
              </div>

            ) : (

              alerts.map((alert, index) => (

                <div
                  key={index}
                  className={`p-4 rounded-lg border mb-4 ${
                    alert.severity === "CRITICAL"
                      ? "bg-red-950 border-red-600"
                      : alert.severity === "HIGH"
                      ? "bg-red-900/30 border-red-500"
                      : alert.severity === "MEDIUM"
                      ? "bg-orange-900/20 border-orange-500"
                      : "bg-yellow-900/20 border-yellow-500"
                  }`}
                >

                  <div className="font-bold text-red-400">
                    {alert.type}
                  </div>

                  <span
                    className={`px-2 py-1 rounded text-sm font-bold ${
                      alert.severity === "CRITICAL"
                        ? "bg-red-700 text-white animate-pulse"
                        : alert.severity === "HIGH"
                        ? "bg-red-500 text-white"
                        : alert.severity === "MEDIUM"
                        ? "bg-orange-500 text-white"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {alert.severity}
                  </span>

                  <div className="mt-1">
                    {alert.message}
                  </div>

                  <div className="text-sm text-gray-400 mt-2">
                    {alert.timestamp}
                  </div>

                </div>

              ))

            )}

          </div>

        </div>

    </div>
  )
}

export default Dashboard