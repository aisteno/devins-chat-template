"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Activity } from "lucide-react"

export default function HomePage() {
    const [isOuraConnected, setIsOuraConnected] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)

    useEffect(() => {
        // Check if Oura is already connected
        const ouraToken = document.cookie.includes('oura_access_token')
        setIsOuraConnected(ouraToken)

        // Check if user just connected Oura
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('connected') === 'true') {
            setShowSuccessMessage(true)
            // Remove the query parameter from URL
            window.history.replaceState({}, document.title, window.location.pathname)
            // Hide success message after 5 seconds
            setTimeout(() => setShowSuccessMessage(false), 5000)
        }
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-6">
            {showSuccessMessage && (
                <div className="fixed top-0 left-0 right-0 bg-green-500 text-white px-4 py-3 text-center font-medium z-50">
                    🎉 Successfully connected to Oura! Your health data is now available for AI coaching.
                </div>
            )}

            <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full w-32 h-32 opacity-20 animate-pulse"></div>
                            <Activity className="w-32 h-32 text-blue-400 relative" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Devin's AI Health Coach
                    </h1>
                    <p className="text-xl text-gray-200">
                        Personalized AI coaching powered by your Oura Ring data
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    {isOuraConnected ? (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Oura Ring Connected
                            </h2>
                            <p className="text-gray-200 mb-8">
                                Your health data is synced and ready for personalized AI coaching
                            </p>
                            <Link
                                href="/chat"
                                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
                            >
                                Open AI Health Coach
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-white mb-2">
                                    Get Started
                                </h2>
                                <p className="text-gray-200">
                                    Choose how you want to experience AI health coaching
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Link
                                    href="/auth/oura"
                                    className="flex items-center justify-between w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
                                >
                                    <div className="text-left">
                                        <div className="font-semibold">Connect Oura Ring</div>
                                        <div className="text-sm opacity-90">Get personalized insights from your health data</div>
                                    </div>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/20"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-transparent text-gray-300">OR</span>
                                    </div>
                                </div>

                                <Link
                                    href="/chat"
                                    className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-4 rounded-lg font-semibold transition-all"
                                >
                                    <div className="text-left">
                                        <div className="font-semibold">Continue Without Oura</div>
                                        <div className="text-sm opacity-90">Access general AI coaching features</div>
                                    </div>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-center text-gray-400 text-sm mt-8">
                    By connecting your Oura Ring, you agree to share health data for AI coaching purposes
                </p>
            </div>
        </main>
    )
}