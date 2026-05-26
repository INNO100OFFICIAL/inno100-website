'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="INNO100 Logo"
              width={120}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/about" className="text-sm hover:text-gray-600 transition">
              About Us
            </Link>
            <Link href="/menu" className="text-sm hover:text-gray-600 transition">
              Menu
            </Link>
            <Link href="/media" className="text-sm hover:text-gray-600 transition">
              Media Centre
            </Link>
            <Link href="/contact" className="text-sm hover:text-gray-600 transition">
              Contact Us
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="/about" className="block py-2 text-sm">About Us</Link>
            <Link href="/menu" className="block py-2 text-sm">Menu</Link>
            <Link href="/media" className="block py-2 text-sm">Media Centre</Link>
            <Link href="/contact" className="block py-2 text-sm">Contact Us</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
