import Navbar from '@/components/Navbar'
import { Button, buttonVariants } from '@/components/ui/button'
import { Download, HomeIcon, Landmark, Loader2, Upload, UserCheck } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import Uploaded from './uploaded'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Uploadeds from './uploads'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import axios from "axios";
import { useAuth } from '@/services/AuthContext'
import { useToast } from '@/components/ui/use-toast'


function Uploads() {
  const { user } = useAuth();
  const { toast } = useToast()
  const [plotName, setPlotName] = useState("");
  const [subscriber, setSubscriber] = useState("");
  const [plotData, setPlotData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const userToken = user?.token;
  console.log(userToken)

  const userEmail = user?.email;


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start loading
    setIsLoading(true);

    // Prepare the request payload
    const requestData = {
      email: userEmail,
      name: plotName,
    };

    try {
      // Make a POST request to the API endpoint with the user's token
      const response = await axios.post(
        'https://virtual.chevroncemcs.com/ballot/plot/single',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle the response data
      setPlotData(response.data);
      console.log(response.data);
      toast({
        title: 'Success!!',
        description: 'The Plot has been uploaded.',
      });
    } catch (error) {
      console.error('Error fetching plot data:', error);
      toast({
        title: 'There was a problem.',
        description: 'There was an error uploading the data',
        variant: 'destructive',
      });
      // Handle the error as needed
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  const handleSubscriberSubmit = async (e) => {
    e.preventDefault();

    // Start loading
    setIsLoading(true);

    // Prepare the request payload
    const requestData = {
      email: userEmail,
      name: subscriber,
    };

    try {
      // Make a POST request to the API endpoint with the user's token
      const response = await axios.post(
        'https://virtual.chevroncemcs.com/ballot/subscriber/single',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle the response data
      setPlotData(response.data);
      console.log(response.data);
      toast({
        title: 'Success!!',
        description: 'The Subscriber has been uploaded.',
      });
    } catch (error) {
      console.error('Error fetching subscriber data:', error);
      toast({
        title: 'There was a problem.',
        description: 'There was an error uploading the subscriber details',
        variant: 'destructive',
      });
      // Handle the error as needed
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto mt-20'>
        {/* <h1 className='font-bold text-3xl md:text-4xl mb-5'>Upload bulk Document</h1> */}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-4 py-6 gap-x-8'>
          {/* Feed */}

          {/* Download Document */}
          <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <Download className='w-4 h-4' />
                Download
              </p>
            </div>

            <div className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                  Download the Excel template for uploading bulk ballots
                </p>
              </div>

              <Link className={buttonVariants({
                className: 'w-full mt-4 mb-6'
              })} href='/r/create'>Download</Link>
            </div>
          </div>

          {/* Upload Document */}
          {/* <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <Upload className='w-4 h-4' />
                Upload
              </p>
            </div>

            <div className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                  Upload the excel file with the correct table adjustments.
                </p>
              </div>

              <Button className="w-full mb-10 hidden" ><Label htmlFor="picture" className="">Upload Document</Label></Button>
              <Input id="picture" type="file" className={buttonVariants({
                className: 'w-full mt-4 mb-6 text-white hidden'
              })} />
            </div>
          </div> */}

          {/* Download Document */}
          <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <Landmark className='w-4 h-4' />
                Upload a Single Plot
              </p>
            </div>

            <div className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                  You can click on the button below to upload a single plot
                </p>
              </div>

              {/* <Link className={buttonVariants({
                className: 'w-full mt-4 mb-6'
              })} href='/r/create'>Download</Link> */}

            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full mt-4 mb-6">Open</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Upload a Single Plot</SheetTitle>
                  <SheetDescription>
                    You can upload a single plot here by putting the name of the plot.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Plot Name
                    </Label>
                    <Input  
                      type="text"
                      placeholder="Enter plot name"
                      value={plotName}
                      onChange={(e) => setPlotName(e.target.value)} className="col-span-3 outline-none" 
                    />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                  <Button onClick={handleSubmit} className="mb-10" disabled={isLoading}>
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
              </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            </div>
          </div>

          {/* Download Document */}
          <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
            <div className='bg-emerald-100 px-6 py-4'>
              <p className='font-semibold py-3 flex items-center gap-1.5'>
                <UserCheck className='w-4 h-4' />
                Upload a Single Subscriber
              </p>
            </div>

            <div className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <p className='text-zinc-500'>
                You can click on the button below to upload a single Subscriber
                </p>
              </div>

              {/* <Link className={buttonVariants({
                className: 'w-full mt-4 mb-6'
              })} href='/r/create'>Download</Link> */}

<Sheet>
              <SheetTrigger asChild>
                <Button className="w-full mt-4 mb-6">Open</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Upload a Single Subscriber</SheetTitle>
                  <SheetDescription>
                    You can upload a single subscriber here by putting the details of the subscriber.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Subscriber
                    </Label>
                    <Input  
                      type="text"
                      placeholder="Enter Subscriber details"
                      value={subscriber}
                      onChange={(e) => setSubscriber(e.target.value)} className="col-span-3 outline-none" 
                    />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                  <Button onClick={handleSubscriberSubmit} className="mb-10" disabled={isLoading}>
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
              </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>

        {/* Render the Uploaded component */}
        <div className='flex items-center space-x-32'>
          <Uploaded />
          <Uploadeds />
          

        </div>
      </div>
    </div>
  )
}

export default Uploads;