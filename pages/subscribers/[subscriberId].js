import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/services/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

function Subscribers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriberData, setSubscriberData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { subscriberId } = router.query;

  const userEmail = user?.email;

  const userToken = user?.token;

  useEffect(() => {
    if (subscriberId) {
      fetchData();
    }
  }, [subscriberId]);

  const fetchData = async () => {
    setIsLoading(true);

    const requestData = {
      email: userEmail,
      ballotId: subscriberId,
    };

    try {
      const response = await axios.post(
        "https://virtual.chevroncemcs.com/ballot/subscribers",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response data by setting it to the 'plotData' state
      setSubscriberData(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching plot data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-20">
        <h1 className="text-3xl font-semibold mb-4">Subscriber Data</h1>
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
                {subscriberData?.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4">{subscriber.name}</td>
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

export default Subscribers;
