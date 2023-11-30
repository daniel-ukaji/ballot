import Navbar from "@/components/Navbar";
import { runFireworks } from "@/confetti";
import React, { useEffect, useState } from "react";

const AllResultsPage = () => {
  const [ballotResults, setBallotResults] = useState([]);


  useEffect(() => {
    runFireworks();
  }, []);

  useEffect(() => {
    // Retrieve the ballotResults from the query parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const resultsParam = urlParams.get("ballotResults");

    if (resultsParam) {
      // Parse the JSON string and set the state
      setBallotResults(JSON.parse(resultsParam));
    }
  }, []);

  return (
    <div>
        <Navbar />
        <div className="max-w-5xl mx-auto mb-10">
            <h1 className="mt-20 flex justify-center items-center font-bold text-3xl">All Ballot Results</h1>
            <h1 className="mt-5 flex justify-center items-center mb-10 font-bold text-xl">Congratulations!!!</h1>
            {/* Render the table with all results */}
            
            <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-200 text-left">
                            Plot Name
                            </th>
                            
                            <th className="px-6 py-3 bg-gray-200 text-left">
                            Subscriber Name
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {ballotResults.map((result) => (
                            <tr key={result.id} className="hover:bg-gray-100">
                            <td  className="px-6 py-4">{result.plotName}</td>
                            <td  className="px-6 py-4">{result.subscriberName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
            </div>

        </div>
    </div>
  );
};

export default AllResultsPage;
