import React, { useState, useEffect } from "react";
import { useAuth } from "@/services/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";
import noresult from "@/public/noresult.png";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";

const Draws = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ballotResults, setBallotResults] = useState([]);
  const userToken = user?.token;
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  console.log(user?.email)
  const router = useRouter();
  const { drawsId } = router.query;

  const userEmail = user?.email

  const itemsPerPage = 10;

  const pageCount = Math.ceil(ballotResults?.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetchData = async () => {
    try {
      setIsFetching(true);
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
        console.log(data.data);
        setBallotResults(data.data);
        toast({
          title: "Success!!",
          description: "The Ballot has been drawn!.",
        });
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
    }
  };

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

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4 mt-20">Ballot Results</h1>

        <div className="flex justify-between mb-5">
          <Button onClick={fetchData} disabled={isFetching || isLoading}>
            {isFetching ? "Drawing..." : "Draw"}
          </Button>

          <Button onClick={handleClearDrawButtonClick} disabled={isLoading}>
            {isLoading ? "Clearing Draw..." : "Clear Draw"}
          </Button>

        </div>

        {ballotResults?.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <Image src={noresult} objectFit="cover" alt="" className="w-1/3" />
            <h1 className="font-bold text-2xl">No Ballot Results</h1>
          </div>
        ) : (
          <div>
            <Button className="mb-5" onClick={handleExportExcel} disabled={isLoading}>
            {isLoading ? "Exporting Excel..." : "Export Excel File"}
          </Button>
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

          </div>
        )}
      </div>
      <div className="mt-4 mb-10">
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
