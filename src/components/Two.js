import React from 'react'
import banner2 from '../assets/banner2.webp'

const Two = () => {
  return (
    <div className="bg-gradient-to-br from-[#131229] to-[#22203a] w-full py-16">
      <div className="container mx-auto flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden">
        <div className="md:w-1/2 w-full">
          <img
            src={banner2}
            alt="Banner"
            className="w-full h-full "
            loading="lazy"
          />
        </div>
        <div className="md:w-1/2 w-full flex flex-col justify-center items-start p-10 ">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Our Website
          </h1>
          <p className="text-lg text-gray-300">
            We provide the best services for you.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Two
