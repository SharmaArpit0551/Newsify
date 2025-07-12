import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Herosection = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    const searchHandler = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            navigate(`/course/search?query=${searchQuery}`)
        }
        setSearchQuery("");
    }


    return (
        <>
            <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-white text-4xl font-bold mb-4">
                        Find the Best Articles for You
                    </h1>
                    <p className="text-gray-200 dark:text-gray-400 mb-8">
                        Discover, Learn, and Upskill with our wide range of News
                    </p>
                    <Button className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200">Explore What happening around?</Button>
                </div>
            </div>


        </>
    )
}

export default Herosection
