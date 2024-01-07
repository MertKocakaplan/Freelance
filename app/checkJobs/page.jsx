"use client";
import { motion } from 'framer-motion'
import React from 'react'
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUserBalance } from '../../lib/useUserBalance';




const ClientJobs = () => {
    const {data:session, update} = useSession()
    const router = useRouter()
    // const [balance,setBalance] = useState(null)
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [isTakeJobActive,setIsTakeJobActive] = useState(false)
    const balance = useUserBalance(session, jobs);
    const [search, setSearch] = useState("")

    // useEffect(() => {
    //     if (!session || !session.user) return;

    //     setBalance(session.user.balance);
    // }, [session])

    // const takeTheJob = (index) => {
    //     console.log("index: ", index)
    //     console.log(jobs)
    //     setIsTakeJobActive(!isTakeJobActive)
    // }

    // useEffect(() => {
    //     if (!session || !session.user) return;
    //     fetch('/api/getUserBalance', {
    //         method: 'POST',
    //         body: JSON.stringify({ id: session.user._id })
    //     })
    //     .then(res => res.json())
    //     .then(data => setBalance(data.balance))
    //     .catch(console.error);
    // }, [session, jobs]);
   
     
    const JobComplate = async (id,price) => {
        // alert("Success!")
        try {
            const jobPrice = parseInt(price); // Girilen fiyatı sayıya dönüştürün
            // const currentBalance = parseInt(session?.user?.balance); // Mevcut bakiyeyi sayıya dönüştürün
            const currentBalance = parseInt(balance); // Mevcut bakiyeyi sayıya dönüştürün
    
            if (!isNaN(jobPrice) && !isNaN(currentBalance)) {
                const updatedBalance = currentBalance + jobPrice; // Fiyatı mevcut bakiyeden çıkarın
                const res = await fetch('/api/updateBalance', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: session?.user?._id,
                        balance: updatedBalance
                    })
                });
    
                if (res.ok) {
                    console.log("Balance updated successfully");

                // const data = await res.json();
                // const { user } = data;
                // console.log('updatedUser', user);
                // update({ user });
                // setBalance(user.balance);
                    
                    
                } else {
                    console.log("Updating balance failed");
                }
            } else {
                console.log("Invalid price or balance");
            }
        } catch (error) {
            console.error("Error during updating balance:", error);
        
        };
        try {
            const response = await fetch(`/api/addJob`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id }) // Request body içerisine parametreyi ekliyoruz
            });            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // const data = await response.json();
            // const { updatedBalance } = data;
            // setBalance(updatedBalance);
            const updatedJobs = jobs.filter((job) => job._id !== id);
            setJobs(updatedJobs);
        } catch (error) {
            console.error('Error deleting job:', error);
        }

    };
   
    
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/addJob'); // Endpoint'iniz buraya gelmeli
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setJobs(data);
                console.log("jobs: ",jobs)
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);
    const handleSearch = (e) =>{
        e.preventDefault()
        setSearch(e.target.value)
        console.log(search)
    }

    useEffect(() => {
        if (!search) {
            setFilteredJobs(jobs);
        } else {

            const filteredJobs = jobs.filter(job =>
                job.name.toLowerCase().includes(search.toLowerCase())
              )
              setFilteredJobs(filteredJobs)
              console.log(jobs)
        }
      }, [search, jobs]);
      const [isTakeJobActiveArray, setIsTakeJobActiveArray] = useState(Array(jobs.length).fill(false));

// takeTheJob fonksiyonu artık index'e göre işlem yapacak
const takeTheJob = (index) => {
    
    console.log(index)
    const updatedTakeJobActiveArray = [...isTakeJobActiveArray]; // Mevcut durumu kopyalıyoruz
    updatedTakeJobActiveArray[index] = !updatedTakeJobActiveArray[index]; // Tıklanan işin durumunu değiştiriyoruz
    setIsTakeJobActiveArray(updatedTakeJobActiveArray); // Yenilenmiş durumu set ediyoruz
};
    
    return (
        <div className='flex items-center justify-center h-screen w-full'>
        
        <motion.div
            initial={{ y: '100vw' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className='w-[60%] h-[60%] border border-slate-400 rounded-2xl shadow-slate-500 relative shadow flex flex-col justify-between p-5 items-center'>
                <form onSubmit={handleSearch} className='w-full flex items-center justify-center gap-2'>
                    <input onChange={(e) => setSearch(e.target.value)}
                            value ={search}
                            type='search' 
                            placeholder='Search Jobs...'
                            className='text-white rounded-lg bg-gray-500 text-3xl'>

                    </input>
                    <button type='submit' className='bg-blue-500 rounded-md px-2 py-1'>Search</button>

                </form>
                {jobs.length === 0 && (
                    <div className='flex justify-center items-center'>
                        <h1 className='text-4xl font-bold'>There is no available job</h1>
                    </div>
                )}
                {jobs.length !== 0 && (

                
                <div>
    <h2 className="text-white text-2xl font-bold mb-4 flex justify-center items-center">Jobs:</h2>
    <ul className="text-white">

        {!filteredJobs && jobs.map((job,index) => (
            <li key={job._id} className="bg-gray-800 rounded-md p-4 my-2 relative">
                <p className="text-xl font-semibold">Name: {job.name}</p>
                <p className="text-lg">Description: {job.description}</p>
                <p className="text-lg">Price: {job.price}</p>
                {/* {!isTakeJobActive && (
                <button id={`takeJobBtn-${index}`} onClick={() => takeTheJob(index)} className='bg-green-500 text-white rounded-md text-xl px-4 py-1 absolute top-0 right-0 '>Take the Job</button>
                )} */}
                 {!isTakeJobActiveArray[index] && (
                    <button onClick={() => takeTheJob(index)} className='bg-green-500 text-white rounded-md text-xl px-4 py-1 absolute top-0 right-0 '>Take the Job</button>
                )}
                {/* {isTakeJobActive && (
                    <div className='flex justify-center absolute top-0 right-0'>
                    <button onClick={() => JobComplate(job._id,job.price)} id={`jobCompleteBtn-${index}`} className='bg-green-700 text-white rounded-md text-xl px-4 py-1  '>I did!</button>
                    <button onClick={() => takeTheJob(index)} className='bg-red-500 text-white rounded-md text-xl px-4 py-1'>Back</button>
                    </div>
                )} */}
                {isTakeJobActiveArray[index] && (
                <div className='flex justify-center absolute top-0 right-0'>
                <button onClick={() => JobComplate(job._id, job.price)} className='bg-green-700 text-white rounded-md text-xl px-4 py-1  '>I did!</button>
                <button onClick={() => takeTheJob(index)} className='bg-red-500 text-white rounded-md text-xl px-4 py-1'>Back</button>
                </div>
                )}
            </li>)
        )}
        {(
        filteredJobs.map((job,index) => (
                <li key={job._id} className="bg-gray-800 rounded-md p-4 my-2 relative">
                    <p className="text-xl font-semibold">Name: {job.name}</p>
                    <p className="text-lg">Description: {job.description}</p>
                    <p className="text-lg">Price: {job.price}</p>
                    {!isTakeJobActiveArray[index] && (
                    <button id={`takeJobBtn-${index}`} onClick={() => takeTheJob(index)} className='bg-green-500 text-white rounded-md text-xl px-4 py-1 absolute top-0 right-0 '>Take the Job</button>
                )}
                    {isTakeJobActiveArray[index] && (
                <div className='flex justify-center absolute top-0 right-0'>
                <button onClick={() => JobComplate(job._id, job.price)} id={`jobCompleteBtn-${index}`} className='bg-green-700 text-white rounded-md text-xl px-4 py-1  '>I did!</button>
                <button onClick={() => takeTheJob(index)} className='bg-red-500 text-white rounded-md text-xl px-4 py-1'>Back</button>
                </div>
                )}
                </li>))

        )}
    </ul>
</div>
)}

                    
                <div className='w-2/3 mx-auto flex justify-center items-center'>
                    <button onClick={() => signOut()} className='bg-red-500 rounded-md text-2xl px-10 py-1 mb-4'>Log out</button>
                </div>
                <div className='absolute top-0 right-0 bg-green-500 px-2 py-1 rounded-tr-2xl text-2xl rounded-bl-md'>Balance: {balance}$</div>

        </motion.div>
        </div>
          )
}

export default ClientJobs