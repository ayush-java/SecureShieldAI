export default function Threats({ alerts = [] }) {
	return (
		<div className="flex-1 p-8 bg-[#020617] text-white">
			<h1 className="text-5xl font-bold text-green-400 mb-2">
				Threat Intelligence Center
			</h1>

			<p className="text-gray-400 mb-8">
				Real-time malicious activity monitoring
			</p>

			<div className="space-y-4">
				{alerts.length === 0 ? (
					<div className="text-gray-400">No threat alerts detected</div>
				) : (
					alerts.map((alert, index) => (
						<div
							key={index}
							className={`p-5 rounded-xl border ${
								alert.severity === "CRITICAL"
									? "bg-red-950 border-red-600"
									: alert.severity === "HIGH"
									? "bg-red-900/20 border-red-500"
									: alert.severity === "MEDIUM"
									? "bg-orange-900/20 border-orange-500"
									: "bg-yellow-900/20 border-yellow-500"
							}`}
						>
							<div className="flex justify-between items-center">
								<h2 className="text-2xl font-bold text-red-400">{alert.type}</h2>

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

							<p className="text-gray-300 mt-4">{alert.message}</p>
							<div className="text-sm text-gray-500 mt-4">{alert.timestamp}</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}
