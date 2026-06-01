import { useState } from "react";

export default function Incidents({ alerts }) {
	const [incidentStatuses, setIncidentStatuses] = useState({});

	const updateStatus = (id, status) => {
		setIncidentStatuses((prev) => ({
			...prev,
			[id]: status,
		}));
	};

	return (
		<div className="min-h-screen bg-[#020617] text-white p-6">
			<h1 className="text-5xl font-bold text-green-400 mb-2">
				Incident Response Center
			</h1>

			<p className="text-gray-400 mb-8">
				SOC investigation and response workflow
			</p>

			<div className="space-y-5">
				{alerts.map((alert, index) => (
					<div
						key={index}
						className={`p-6 rounded-xl border ${
							incidentStatuses[index] === "Resolved"
								? "bg-green-950 border-green-600"
								: incidentStatuses[index] === "Escalated"
								? "bg-red-950 border-red-600"
								: alert.severity === "CRITICAL"
								? "bg-red-950 border-red-600"
								: alert.severity === "HIGH"
								? "bg-red-900/20 border-red-500"
								: alert.severity === "MEDIUM"
								? "bg-orange-900/20 border-orange-500"
								: "bg-yellow-900/20 border-yellow-500"
						}`}
					>
						<div className="flex justify-between items-center">
							<div>
								<h2 className="text-3xl font-bold text-red-400">
									Incident #{index + 100}
								</h2>

								<p className="text-lg mt-2">
									{alert.type}
								</p>
							</div>

							<span
								className={`px-3 py-1 rounded font-bold ${
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
						</div>

						<p className="text-gray-300 mt-4">
							{alert.message}
						</p>

						<div className="flex gap-8 mt-5 text-sm">
							<span className="text-green-400">
								Timestamp: {alert.timestamp}
							</span>

							<span className="text-cyan-400">
								Assigned: AI SOC
							</span>

							<span className="text-pink-400">
								Status: {incidentStatuses[index] || "Investigating"}
							</span>
						</div>

						<div className="flex gap-4 mt-6">
							<button
								onClick={() => updateStatus(index, "Resolved")}
								className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold"
							>
								Resolve
							</button>

							<button
								onClick={() => updateStatus(index, "Escalated")}
								className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
							>
								Escalate
							</button>

							<button
								onClick={() => updateStatus(index, "Investigating")}
								className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-bold"
							>
								Investigate
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
