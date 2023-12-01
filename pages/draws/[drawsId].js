import React, { useState, useEffect } from "react";
import { useAuth } from "@/services/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";
import noresult from "@/public/noresult.png";
import drawkit from "@/public/DrawKit.png";
import undraw from "@/public/undraw.png";
import ReactPaginate from "react-paginate";
import { PacmanLoader } from 'react-spinners';
import * as XLSX from "xlsx";

const Draws = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ballotResults, setBallotResults] = useState([]);
  const userToken = user?.token;
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Display 5 results per page
  const [showSpinner, setShowSpinner] = useState(false); // Controls the spinner
  const [showFullPageSpinner, setShowFullPageSpinner] = useState(false); // Controls the full-page spinner

  console.log(user?.email);
  const router = useRouter();
  const { drawsId } = router.query;

  const ballotName = router.query.name;

  console.log('Draw Name:', ballotName);

  const userEmail = user?.email;

  // Calculate page count based on items per page
  const pageCount = Math.ceil(ballotResults?.length / itemsPerPage);

  const handleShowAllResultsClick = () => {
    // Pass the ballotResults data to the new page using query params
    router.push({
      pathname: "/all-results",
      query: { ballotResults: JSON.stringify(ballotResults) },
    });
  };


  // Function to save data to local storage
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const fetchDataWithDelay = async () => {
    setIsFetching(true);
    setShowFullPageSpinner(true); // Show the full-page spinner when fetching data

    // Delay the data fetching by, for example, 2 seconds (you can adjust the delay duration as needed)
    setTimeout(async () => {
      try {
        const response = await fetch(
          "https://virtual.chevroncemcs.com/ballot/draws",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userEmail,
              ballotId: drawsId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBallotResults(data.data);
          toast({
            title: "Success!!",
            description: "The Ballot has been drawn!.",
          });

          // Save the results to local storage
          saveToLocalStorage(`ballotResults_${drawsId}`, data.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "There was a problem.",
          description: "There was an error drawing the ballot!",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
        setShowFullPageSpinner(false); // Hide the full-page spinner when data fetching is complete
      }
    }, 9000); // 2-second delay (adjust the duration as needed)
  };

  // const fetchData = async () => {
  //   try {
  //     setIsFetching(true);
  //     setShowFullPageSpinner(true); // Show the full-page spinner when fetching data

  //     const response = await fetch(
  //       "https://virtual.chevroncemcs.com/ballot/draws",
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email: userEmail,
  //           ballotId: drawsId,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setBallotResults(data.data);
  //       toast({
  //         title: "Success!!",
  //         description: "The Ballot has been drawn!.",
  //       });

  //       // Save the results to local storage
  //       saveToLocalStorage(`ballotResults_${drawsId}`, data.data);
  //     } else {
  //       console.error("Failed to fetch data");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     toast({
  //       title: "There was a problem.",
  //       description: "There was an error drawing the ballot!",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsFetching(false);
  //     setShowFullPageSpinner(false); // Hide the full-page spinner when data fetching is complete
  //   }
  // };

  const handleClearDrawButtonClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://virtual.chevroncemcs.com/ballot/draws",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            ballotId: drawsId,
          }),
        }
      );

      if (response.ok) {
        setBallotResults([]);
        toast({
          title: "Success!!",
          description: "The Ballot has been Cleared!.",
        });
        console.log(response);

        // Clear the data from local storage
        localStorage.removeItem(`ballotResults_${drawsId}`);
      } else {
        console.error("Failed to delete ballot");
      }
    } catch (error) {
      console.error("Error deleting ballot:", error);
      toast({
        title: "There was a problem.",
        description: "There was an error clearing the data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadFromLocalStorage = (key) => {
      try {
        const savedData = localStorage.getItem(key);
        return savedData ? JSON.parse(savedData) : null;
      } catch (error) {
        console.error("Error loading from local storage:", error);
        return null;
      }
    };

    const savedResults = loadFromLocalStorage(`ballotResults_${drawsId}`);
    if (savedResults) {
      setBallotResults(savedResults);
    }
  }, [drawsId]);

  const handleExportExcel = () => {
    setIsLoading(true);

    const dataToExport = [
      ['Plot Name', 'Subscriber Name'],
      ...ballotResults.map((result) => [result.plotName, result.subscriberName]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, 'Ballot Results');

    XLSX.writeFile(wb, 'ballot_results.xlsx');

    setIsLoading(false);
  };

  // Function to handle user's selection of items per page
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0); // Reset to the first page when changing items per page
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  

  // Function to handle "Next" button click
  const handleNextButtonClick = () => {
    setShowSpinner(true); // Show the spinner within the table
    setShowFullPageSpinner(true); // Show the full-page spinner
    setTimeout(() => {
      setCurrentPage((prevPage) => prevPage + 1); // Move to the next page
      setShowSpinner(false); // Hide the spinner within the table
      setShowFullPageSpinner(false); // Hide the full-page spinner
    }, 5000);
  };

  // Function to handle "Previous" button click
  const handlePrevButtonClick = () => {
    setCurrentPage((prevPage) => prevPage - 1); // Move to the previous page
  };

  return (
    <div>
      {/* Full-page spinner overlay */}
      {showFullPageSpinner && (
        <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-white opacity-100 z-50">
          {/* <h1 className="font-bold text-3xl">Ballot is Loading...</h1> */}
          <PacmanLoader size={50} color="#272E3F" />
        </div>
      )}
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <div className="">
          <h1 className="text-3xl font-semibold mb-4 mt-20">Ballot Result: {ballotName}</h1>
        </div>

        <div className="flex justify-between mb-5">
          <Button className="bg-[#2187C0]" onClick={fetchDataWithDelay} disabled={isFetching || isLoading}>
            {isFetching ? "Drawing..." : "Draw"}
          </Button>
          <Button className="bg-[#2187C0]" onClick={handleClearDrawButtonClick} disabled={isLoading}>
            {isLoading ? "Clearing Draw..." : "Clear Draw"}
          </Button>
        </div>

        {ballotResults?.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
                        <h1 className="font-bold text-2xl">No Ballot Results</h1>
            <Image src={undraw} objectFit="cover" alt="" className="w-1/2 object-cover" />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <Button className="mb-5 bg-[#2187C0]" onClick={handleExportExcel} disabled={isLoading}>
                {isLoading ? "Exporting Excel..." : "Export Excel File"}
              </Button>
              <div>
                <label htmlFor="itemsPerPage" className="mr-2">
                  Draws per page:
                </label>
                <select
                  id="itemsPerPage"
                  onChange={handleItemsPerPageChange}
                  value={itemsPerPage}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200 mb-10">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plot Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscriber Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ballotResults
                  ?.slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )
                  .map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{result.plotName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{result.subscriberName}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* "Next" and "Previous" buttons */}
            <div className="flex justify-between">
              {currentPage > 0 && (
                <Button className="bg-[#2187C0]" onClick={handlePrevButtonClick}>Previous</Button>
              )}
              {currentPage < pageCount - 1 && (
                <Button className="bg-[#2187C0]" onClick={handleNextButtonClick}>
                  {showSpinner ? (
                    <>
                      <span className="mr-2">Loading...</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              )}
            </div>
            {/* "Show All Results" button */}
      <div className="flex justify-center mt-4">
        <Button
          className="bg-[#2187C0]"
          onClick={handleShowAllResultsClick}
          // disabled={isLoading || isFetching}
        >
          Show All Results
        </Button>
      </div>
          </div>
        )}
      </div>

      <div className="mt-4 mb-10 hidden">
      <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName="pagination flex justify-center space-x-2"
          activeClassName="bg-[#272E3F] text-white"
          pageClassName="hover:bg-blue-200 transition-colors duration-200 rounded-full px-3 py-2 cursor-pointer"
          breakClassName="text-gray-400 mx-2"
          previousClassName="hover:bg-blue-200 transition-colors duration-200 rounded-full px-3 py-2 cursor-pointer"
          nextClassName="hover:bg-blue-200 transition-colors duration-200 rounded-full px-3 py-2 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Draws;
