import React, { useState, useEffect } from "react";
import BallotResult from "@/components/BallotResult";
import { useAuth } from "@/services/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";
import noresult from "@/public/noresult.png"

const BallotResultsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ballotResults, setBallotResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 1; // Change this to the desired number of results per page
  const userToken = user?.token;
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false); // New state variable
  const router = useRouter()

  // Function to fetch data
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
            email: "chevroncemcs@outlook.com",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setBallotResults(data.data);
        // Save the ballot results to local storage
        localStorage.setItem("ballotResults", JSON.stringify(data.data));
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

  // Function to load saved ballot results from local storage
  const loadSavedResults = () => {
    const savedResults = localStorage.getItem("ballotResults");
    if (savedResults) {
      setBallotResults(JSON.parse(savedResults));
    }
  };

  useEffect(() => {
    // Load saved ballot results when the component mounts
    loadSavedResults();
  }, []);

  const handleDrawButtonClick = () => {
    // Trigger the "Draw" button click event
    fetchData();
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://virtual.chevroncemcs.com/ballot/draws", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "chevroncemcs@outlook.com",
        }),
      });
  
      const responseData = await response.json();
      console.log(responseData); // Log the response data
  
      if (response.ok) {
        // Clear the data in your local state and Local Storage
        setBallotResults([]);
        localStorage.removeItem("ballotResults"); // Remove the data from Local Storage
        toast({
          title: 'Success!!',
          description: 'The Ballot has been Cleared!.',
        });
      } else {
        console.error("Failed to delete ballot");
      }
    } catch (error) {
      console.error("Error deleting ballot:", error);
      toast({
        title: 'There was a problem.',
        description: 'There was an error clearing the data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleClearDrawButtonClick = () => {
    // Trigger the "Clear Draw" button click event
    handleDelete();
  };

  const moveToNextResult = () => {
    setIsLoadingNext(true);
  
    // Remove the delay or set it to a very short duration (e.g., 0 milliseconds)
    // Simulate a 0-second delay
    setTimeout(() => {
      setIsLoadingNext(false);
      setCurrentPage(currentPage + 1);
    }, 0); // 0 milliseconds
  };
  
  const handleNextButtonClick = () => {
    if (currentPage === ballotResults.length / resultsPerPage) {
      // If you've reached the final result, change the button text
      // to "See All Results" and handle navigation
      router.push("/allresultspage"); // Replace with your desired route
    } else {
      // Move to the next result with a delay
      moveToNextResult();
    }
  };

  const displayResults = () => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
  
    if (ballotResults.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center">
            <Image src={noresult} alt="" objectFit="cover" className="w-1/3" />
            <h1 className="font-bold text-2xl">No Ballot Results</h1>
        </div>
      );
    }
  
    return (
      <div>
        {ballotResults?.slice(startIndex, endIndex).map((result) => (
          <div key={result.id}>
            {isLoadingResult ? (
              // Display a loading spinner or message while fetching the result
              <div className="flex justify-center items-center">
                <Loader2 className="mr-2 h-20 w-20 animate-spin" />
              </div>
            ) : (
              // Render the ballot result
              <BallotResult result={result} />
            )}
          </div>
        ))}
  
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoadingNext}
          >
            Previous
          </Button>
          {currentPage === Math.ceil(ballotResults?.length / resultsPerPage) ? (
            <Button onClick={handleNextButtonClick}>See All Results</Button>
          ) : (
            <Button onClick={handleNextButtonClick} disabled={isLoadingNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    );
  };
  

  useEffect(() => {
    // When the current page changes, simulate a 5-second delay before displaying the result
    if (currentPage > 0 && currentPage <= ballotResults.length) {
      setIsLoadingResult(true);
      setTimeout(() => {
        setIsLoadingResult(false);
      }, 5000); // 5000 milliseconds (5 seconds)
    }
  }, [currentPage, ballotResults]);

  

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4 mt-20">Ballot Results</h1>

        <div className="flex justify-between mb-10">
          <Button onClick={handleDrawButtonClick} disabled={isFetching || isLoading}>
            {isFetching ? "Drawing..." : "Draw"}
          </Button>

          <Button onClick={handleClearDrawButtonClick} disabled={isLoading}>
            {isLoading ? "Clearing Draw..." : "Clear Draw"}
          </Button>
        </div>

        {isFetching || isLoading ? (
          // Render a loading spinner or message while fetching
          <div className="flex justify-center items-center">
            <Loader2 className="mr-2 h-20 w-20 animate-spin" />
          </div>
        ) : (
          // Render the ballot results
          displayResults()
        )}
      </div>
    </div>
  );
};

export default BallotResultsPage;
