import Image from 'next/image';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/services/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from 'react'; // Import useEffect
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { fetchBallotData } from '@/services/api';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { user, logout } = useAuth();
  const [createBallot, setCreateBallot] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ballotData, setBallotData] = useState([]); // Store the fetched data in state
  console.log(user?.email)
  
  const router = useRouter();

  const userToken = user?.token;

  const userEmail = user?.email;
  

  useEffect(() => {
    // Redirect to signin page if user is not logged in
  if (!user) {
    router.push('/signin'); // Replace '/signin' with the actual URL of your signin page
    return;
  }

    const fetchData = async () => {
      try {
        const responseData = await fetchBallotData(userEmail, user?.token);
        setBallotData(responseData.data);
        console.log(responseData)
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching ballot data:', error); 
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ userEmail, userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const requestData = {
      email: userEmail,
      name: createBallot,
    };

    try {
      const response = await axios.post(
        'https://virtual.chevroncemcs.com/ballot/ballot',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setCreateBallot(response.data);
      console.log(response.data);
      toast({
        title: 'Success!!',
        description: 'The Ballot has been created!!',
      });

      router.reload();
    } catch (error) {
      console.error('Error fetching plot data:', error);
      toast({
        title: 'There was a problem.',
        description: 'There was an error creating the ballot',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='max-w-3xl mx-auto mt-32'>
        <div className='mb-5 flex justify-end'>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center bg-[#2187C0]">Create Ballot <PlusIcon className='w-4 h-4 ml-2' /> </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Ballot</DialogTitle>
                <DialogDescription>
                  Create the type of ballot you want to have by typing the name.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Ballot Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Ballot Name"
                    value={createBallot}
                    onChange={(e) => setCreateBallot(e.target.value)} 
                    className="col-span-3 outline-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} className="mb-10 bg-[#2187C0]" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className='border rounded-md'>
          <h1 className='font-bold text-3xl flex flex-col justify-center items-center mt-5'>Ballot Data</h1>
          <div className='p-4'>
            {isLoading ? (
              <div className='flex justify-center items-center'>
                <Loader2 className="mr-2 h-10 w-10 animate-spin" />
              </div>
            ) : (
              <div>
                {ballotData?.map((item) => {
                  const ballotId = item.id; // Declare the variable here
                  return (
                    <p className='flex items-center justify-between font-bold' key={item.id}>
                      {item.name} <Link href={`/ballot/${ballotId}?name=${encodeURIComponent(item.name)}`}>
                        <Button className="mt-2 bg-[#2187C0]">View</Button>
                      </Link>

                    </p>
                  );
                })}
              </div>

            )}
          </div>
        </div>
      </div>
    </div>
  )
}
