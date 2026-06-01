import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
} from "recharts";

export default function Analytics({ alerts }) {
	const attackCounts = {
		SQLi: alerts.filter((a) =>
			a.type.includes("SQL")
		).length,

		XSS: alerts.filter((a) =>
			a.type.includes("XSS")
		).length,

		BruteForce: alerts.filter((a) =>
			a.type.includes("Brute")
		).length,

		FailedLogin: alerts.filter((a) =>
			a.type.includes("Failed")
		).length,
	};

	const pieData = [
		{ name: "SQLi", value: attackCounts.SQLi },
		{ name: "XSS", value: attackCounts.XSS },
		{ name: "Brute Force", value: attackCounts.BruteForce },
		{ name: "Failed Login", value: attackCounts.FailedLogin },
	];

	const severityData = [
		{
			severity: "LOW",
			count: alerts.filter((a) => a.severity === "LOW").length,
		},
		{
			severity: "MEDIUM",
			count: alerts.filter((a) => a.severity === "MEDIUM").length,
		},
		{
			severity: "HIGH",
			count: alerts.filter((a) => a.severity === "HIGH").length,
		},
		{
			severity: "CRITICAL",
			count: alerts.filter((a) => a.severity === "CRITICAL").length,
		},
	];

	const COLORS = [
		"#22c55e",
		"#3b82f6",
		"#f59e0b",
		"#ef4444",
	];

	return (
		<div className="min-h-screen bg-[#020617] text-white p-6">
			<h1 className="text-5xl font-bold text-green-400 mb-2">
				Security Analytics Center
			</h1>

			<p className="text-gray-400 mb-8">
				Real-time SIEM analytics and attack intelligence
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
				<div className="bg-[#111827] p-6 rounded-xl border border-green-500">
					<h2 className="text-2xl font-bold text-green-400 mb-6">
						Attack Distribution
					</h2>

					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={pieData}
								dataKey="value"
								outerRadius={120}
								label
							>
								{pieData.map((entry, index) => (
									<Cell
										key={index}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>

							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>

				<div className="bg-[#111827] p-6 rounded-xl border border-cyan-500">
					<h2 className="text-2xl font-bold text-cyan-400 mb-6">
						Severity Distribution
					</h2>

					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={severityData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

							<XAxis dataKey="severity" stroke="#22c55e" />

							<YAxis stroke="#22c55e" />

							<Tooltip />

							<Bar dataKey="count" fill="#22c55e" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="bg-[#111827] p-6 rounded-xl border border-pink-500 mt-8">
				<h2 className="text-2xl font-bold text-pink-400 mb-6">
					Top Threat Summary
				</h2>

				<table className="w-full text-left">
					<thead>
						<tr className="text-green-400 border-b border-gray-700">
							<th className="pb-3">Attack Type</th>
							<th className="pb-3">Count</th>
						</tr>
					</thead>

					<tbody>
						{pieData.map((item, index) => (
							<tr
								key={index}
								className="border-b border-gray-800"
							>
								<td className="py-3">{item.name}</td>
								<td className="py-3">{item.value}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
