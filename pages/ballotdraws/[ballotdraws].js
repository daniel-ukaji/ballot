import React from 'react'

function BallotDrawsId() {
  return (
    <div>ballotdraws</div>
  )
}
export default BallotDrawsId

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "@/services/AuthContext";
// import Navbar from "@/components/Navbar";
// import { useRouter } from "next/router";
// import { fetchDrawsData } from "@/services/api";
// import { runFireworks } from "@/services/confetti";

// const BallotDrawsId = () => {
//     const { user } = useAuth();
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();
//     const { ballotdraws } = router.query;
  
//     const userToken = user?.token;
//     const userEmail = user?.email;
  
//     // Function to fetch data
//     const fetchData = useCallback(async (ballotId) => {
//       try {
//           const responseData = await fetchDrawsData(userEmail, ballotId, userToken);
//           setData(responseData.data);
//           console.log(responseData)
//           setLoading(false);
//       } catch (error) {
//           console.error('Error fetching ballot data:', error);
//           setLoading(false);
//       }
//   }, [userEmail, userToken]);

//   useEffect(() => {
//       // Check if ballotdraws is available in the URL query
//       if (ballotdraws) {
//           // If it is, save it to localStorage
//           localStorage.setItem("ballotdraws", ballotdraws);
//           fetchData(ballotdraws);
//       } else {
//           // If not in URL query, check if it's in localStorage
//           const savedBallotdraws = localStorage.getItem("ballotdraws");
//           if (savedBallotdraws) {
//               // If found in localStorage, use that value
//               fetchData(savedBallotdraws);
//           } else {
//               // Handle the case where ballotdraws is not available anywhere
//               setLoading(false);
//           }
//       }
//       // runFireworks(); // You can uncomment this if needed
//   }, [ballotdraws, fetchData]);

//   return (
//     <div>
//       <Navbar />
//       <h1 className="text-3xl font-semibold mb-10 mt-20 text-center">Ballot Draws</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : data?.length === 0 ? (
//         <p>No data available</p>
//       ) : (
//         <div className="max-w-7xl mx-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr>
//                 {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                   ID
//                 </th> */}
//                 {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                   Plot ID
//                 </th> */}
//                 <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                   Plot Name
//                 </th>
//                 {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                   Subscriber ID
//                 </th> */}
//                 <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                   Subscriber Name
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {data?.map((item) => (
//                 <tr key={item.plotName}>
//                   {/* <td className="px-6 py-4 whitespace-no-wrap">{item.id}</td> */}
//                   {/* <td className="px-6 py-4 whitespace-no-wrap">{item.plotId}</td> */}
//                   <td className="px-6 py-4 whitespace-no-wrap">{item.plotName}</td>
//                   {/* <td className="px-6 py-4 whitespace-no-wrap">{item.subscriberId}</td> */}
//                   <td className="px-6 py-4 whitespace-no-wrap">{item.subscriberName}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BallotDrawsId;
