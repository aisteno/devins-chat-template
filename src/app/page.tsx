"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
    const [isOuraConnected, setIsOuraConnected] = useState(false)

    useEffect(() => {
        // Check if Oura is already connected
        const ouraToken = document.cookie.includes('oura_access_token')
        setIsOuraConnected(ouraToken)
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#2B9FD9] via-[#1E88C7] to-[#1B7AB8] flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white space-y-8">
                        {/* Logo */}
                        <div className="mb-8">
                            <Image
                                src="https://res.cloudinary.com/dkxonvvu8/image/upload/v1759842971/logo_envo8w.png"
                                alt="Sleep Science Academy"
                                width={180}
                                height={60}
                                className="h-auto"
                            />
                        </div>

                        {/* Main Heading */}
                        <div>
                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Your Sleep
                                <br />
                                <span className="text-[#5AB9E8]">Coach AI</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg">
                                Transform your sleep with AI-powered sleep coaching from sleep expert Devin Burke. Get personalized sleep plans, evidence-based strategies, and real-time guidance 24/7.
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-white/90 font-medium">4.7/5 from 1500+ users</span>
                        </div>

                        {/* CTA Button */}
                        {isOuraConnected ? (
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/50 rounded-lg px-4 py-2">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-white font-medium">Oura Ring Connected</span>
                                </div>
                                <div>
                                    <Link
                                        href={process.env.NEXT_PUBLIC_CHAT_REDIRECT_URL!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-white text-[#1E88C7] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        Open AI Sleep Coach
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Link
                                    href="/auth/oura"
                                    className="inline-block bg-white text-[#1E88C7] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Connect to Oura Ring
                                </Link>
                                <div className="text-sm">
                                    <Link
                                        href={process.env.NEXT_PUBLIC_CHAT_REDIRECT_URL!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/80 hover:text-white underline"
                                    >
                                        or continue without Oura Ring
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Feature List */}
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white/90" />
                                <span className="text-white/90">Trusted by sleepers worldwide</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white/90" />
                                <span className="text-white/90">Evidence-based sleep science</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-white/90" />
                                <span className="text-white/90">Cancel anytime</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative lg:block hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl transform rotate-3"></div>
                            <Image
                                src="https://res.cloudinary.com/dkxonvvu8/image/upload/v1759842972/profile_uk7a2y.jpg"
                                alt="Devin Burke - Sleep Expert"
                                width={600}
                                height={700}
                                className="relative rounded-3xl shadow-2xl object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}