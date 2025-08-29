import React, { useState } from 'react'
import Navbar from '../components/navbar'
import SidebarFilter from '../components/Sidebar'
import { Toaster } from 'react-hot-toast'

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <main className=''>

            <div className="flex min-h-screen">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <div className={`
                    fixed left-0 top-0 h-full w-80 z-40 pt- 
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}>
                    <SidebarFilter />
                </div>
                <main className="flex-1 lg:ml-80 bg-slate-700 min-h-screen">
                    <div className="lg:hidden p-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    <Navbar />
                    <div className="">
                        <Toaster position="bottom-right" />
                        {children}
                    </div>
                </main>
            </div>
        </main>
    )
}

export default Mainlayout