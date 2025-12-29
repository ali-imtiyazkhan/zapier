import Appbar from '@/component/Appbar'
import Hero from '@/component/Hero'
import HeroVideo from '@/component/HeroVideo'
import React from 'react'

const page = () => {
  return (
    <div className='bg-white min-h-screen max-w-full text-black'>
      <Appbar />
      <Hero />
      <HeroVideo />
    </div>
  )
}

export default page