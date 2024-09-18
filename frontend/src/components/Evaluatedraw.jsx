import React from 'react';
import { FaChartBar, FaTimes } from 'react-icons/fa';

function Evaluatedraw({ results, isLoading, onClose, isDarkTheme }) {
	const renderResult = (result) => {
		if (typeof result.result === 'string') {
			try {
				const parsedResult = JSON.parse(result.result);
				return parsedResult.map((item, index) => (
					<div key={index} className="mt-1">
						<span className={`font-medium ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
							Answer: {item.expr} = {item.result}
						</span>
					</div>
				));
			} catch (error) {
				return <p className={`mt-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{result.result}</p>;
			}
		}
		return <p className={`mt-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{result.result}</p>;
	};

	return (
		<div className={`fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-200'}`}>
			<div className={`relative rounded-lg shadow-xl max-w-md w-full ${isDarkTheme ? 'bg-gray-700' : 'bg-white'}`}>
				<div className={`flex justify-between items-center p-4 border-b ${isDarkTheme ? 'border-gray-600' : 'border-gray-200'}`}>
					<div className="flex items-center">
						<FaChartBar className={`text-xl mr-2 ${isDarkTheme ? 'text-blue-400' : 'text-blue-500'}`} />
						<h2 className={`text-xl font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Analysis Results</h2>
					</div>
					<button onClick={onClose} className={`${isDarkTheme ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
						<FaTimes />
					</button>
				</div>
				<div className="p-4">
					{isLoading ? (
						<div className="flex justify-center items-center py-8">
							<div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 ${isDarkTheme ? 'border-blue-400' : 'border-blue-500'}`}></div>
						</div>
					) : results.length > 0 ? (
						<ul className="space-y-4">
							{results.map((result, index) => (
								<li key={index} className={`p-3 rounded ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-50'}`}>
									<div className={`font-medium ${isDarkTheme ? 'text-blue-300' : 'text-blue-600'}`}>
										Question: {result.expr}
									</div>
									{renderResult(result)}
								</li>
							))}
						</ul>
					) : (
						<p className={`italic ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No results to display yet.</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default Evaluatedraw;