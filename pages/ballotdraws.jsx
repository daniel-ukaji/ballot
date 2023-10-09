import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/services/AuthContext";
import Navbar from "@/components/Navbar";

const BallotDraws = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  const userToken = user?.token;
  console.log(userToken);

  // Define the request body
  const requestBody = {
    email: "chevroncemcs@outlook.com",
  };

  useEffect(() => {
    // Define the headers
    const headers = {
      "Authorization": `Bearer ${userToken}`,
      "Content-Type": "application/json",
    };
  
    // Make the GET request to the API endpoint with the request body and headers
    axios
      .get("https://virtual.chevroncemcs.com/ballot/draws", {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${userToken}`,
        },
        params: {
          email: "chevroncemcs@outlook.com",
        },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [userToken]); // Include userToken in the dependency array
  

  return (
    <div>
      <Navbar />
      <h1 className="text-3xl font-semibold mb-4 mt-4">Ballot Draws</h1>
      {loading ? (
        <p>Loading...</p>
      ) : data?.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Plot ID
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Plot Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Subscriber ID
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Subscriber Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-no-wrap">{item.id}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{item.plotId}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{item.plotName}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{item.subscriberId}</td>
                  <td className="px-6 py-4 whitespace-no-wrap">{item.subscriberName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BallotDraws;
