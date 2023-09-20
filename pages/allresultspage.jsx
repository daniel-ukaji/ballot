import React from "react";
import BallotResult from "@/components/BallotResult";

const AllResultsPage = ({ ballotResults }) => {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4 mt-20">All Ballot Results</h1>
      {ballotResults?.map((result) => (
        <BallotResult key={result.id} result={result} />
      ))}
    </div>
  );
};

export default AllResultsPage;
