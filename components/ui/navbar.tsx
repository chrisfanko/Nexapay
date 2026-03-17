"use client";
import Link from 'next/link'
import React from 'react'
import UserButton from './userButton'

const Navbar = () => {
  return (
   <nav className='fixed top-0 w-full flex items-center justify-around py-1 px-8 border-b border-gray-700 bg-blue-400 z-50'>
    <Link href="/"  className='inline-flex items-center gap-2 mb-4'>
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-zinc-950 font-black text-sm">N</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Nexa<span className="text-zinc-400">Pay</span>
              </span>
     
      
    </Link>
    <ul className='flex gap-10 text-lg'>
       <li>
        <Link href="/about" className='text-gray-300 hover:text-white transition-colors'>
         About
        </Link>
        </li> 
    </ul>

    <ul className='flex gap-10 text-lg'>
       <li>
        <Link href="/solutions" className='text-gray-300 hover:text-white transition-colors'>
         Solutions 
        </Link>
        </li> 
    </ul>

    <ul className='flex gap-10 text-lg'>
       <li>
        <Link href="/developer" className='text-gray-300 hover:text-white transition-colors'>
         Developer 
        </Link>
        </li> 
    </ul>

    <ul className='flex gap-10 text-lg'>
       <li>
        <Link href="/contact" className='text-gray-300 hover:text-white transition-colors'>
         Contact
        </Link>
        </li> 
    </ul>

    <ul className='flex gap-10 text-lg'>
       <li>
        <Link href="/prices" className='text-gray-300 hover:text-white transition-colors'>
         Prices 
        </Link>
        </li> 
    </ul>

    <UserButton/>
   </nav>
  )
}

export default Navbar
