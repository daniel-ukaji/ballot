// BallotResult.js
import React from "react";

const BallotResult = ({ result }) => {
  return (
    <div className="p-4 border border-gray-300 mb-4">
      <h2 className="text-xl font-semibold mb-2">Ballot {result.plotId}</h2>
      <div className="flex items-center space-x-5">
        <h1 className="font-base text-2xl">Plot Name:</h1> <h1 className="font-bold text-3xl">{result.plotName}</h1>
      </div>
      <div className="flex items-center space-x-5">
      <h1 className="font-base text-2xl">Subscriber Name:</h1> <h1 className="font-bold text-3xl">{result.subscriberName}</h1>
      </div>
    </div>
  );
};

export default BallotResult;
