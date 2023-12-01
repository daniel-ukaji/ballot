import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/services/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Plots() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plotData, setPlotData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { plotId } = router.query;

  const ballotName = router.query.name;

  console.log('Plot Name:', ballotName);

  const userToken = user?.token;
  const userEmail = user?.email;

  useEffect(() => {
    if (plotId) {
      fetchData();
    }
  }, [plotId]);

  const fetchData = async () => {
    setIsLoading(true);

    const requestData = {
      email: userEmail,
      ballotId: plotId,
    };

    try {
      const response = await axios.post(
        "https://virtual.chevroncemcs.com/ballot/plots",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response data by setting it to the 'plotData' state
      setPlotData(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching plot data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    const requestData = {
      email: userEmail,
      ballotId: plotId,
    };

    try {
      const response = await axios.delete(
        "https://virtual.chevroncemcs.com/ballot/plot",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          data: requestData, // Include your request body here
        }
      );

      // Handle the response data if needed
      console.log(response.data);

      toast({
        title: 'Success!!',
        description: 'The Subscribers has been cleared!.',
      });
      // Show a toast message for successful deletion
      // toast.success("Plot list has been cleared successfully!");
      window.location.reload();

    } catch (error) {
      console.error("Error deleting plot data:", error);
      // Handle error and show a toast message for failure
      // toast.error("Failed to clear plot list.");
      toast({
        title: 'There was a problem.',
        description: 'There was an error clearing the subscribers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-20 mb-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-semibold mb-4">Plots: {ballotName}</h1>
          <Button
          onClick={handleDelete}
          className="bg-[#2187C0]"
        >
          Delete Plots
        </Button>
        </div>
        {isLoading ? (
            <div className='flex justify-center items-center'>
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-200 text-left">Name</th>
                  {/* <th className="px-6 py-3 bg-gray-200 text-left">Ballot ID</th> */}
                  {/* <th className="px-6 py-3 bg-gray-200 text-left">Taken</th> */}
                  {/* <th className="px-6 py-3 bg-gray-200 text-left">Date Created</th> */}
                </tr>
              </thead>
              <tbody>
                {plotData?.map((plot) => (
                  <tr key={plot.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4">{plot.name}</td>
                    {/* <td className="px-6 py-4">{plot.ballotId}</td> */}
                    {/* <td className="px-6 py-4">{plot.taken}</td> */}
                    {/* <td className="px-6 py-4">{plot.dateCreated}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Plots;
