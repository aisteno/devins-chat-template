"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronDown, ChevronUp, Play, User, Zap, Sun, Sparkles, Map, Brain, Activity, Heart, Smartphone } from "lucide-react"

export default function HomePage() {
    const [isOuraConnected, setIsOuraConnected] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [chatLoaded, setChatLoaded] = useState(false)

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

    const openChat = () => {
        if (!chatLoaded) {
            // Create and inject the Steno embed script
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/gh/aisteno/embed@latest/steno-chat.js'

            const chatId = process.env.NEXT_PUBLIC_STENO_CHAT_ID || 'devin-ai-SxIFG3'
            script.setAttribute('data-id', chatId)
            script.setAttribute('data-position', 'right')
            script.setAttribute('data-mode', 'fullscreen')

            // Add backend=dev for local/non-Vercel environments
            const isProduction = process.env.VERCEL_ENV === 'production' || window.location.hostname.includes('vercel.app')
            if (!isProduction) {
                script.setAttribute('data-backend', 'dev')
            }

            // The embed script automatically:
            // 1. Reads cookies from your domain (including oura_access_token)
            // 2. Creates an iframe with chat.steno.ai
            // 3. Passes the cookies to the iframe via postMessage
            // 4. The chat can then access the Oura token

            document.body.appendChild(script)
            setChatLoaded(true)
        } else {
            // If already loaded, trigger the chat to open
            // The embed script adds a global function to toggle the chat
            if ((window as any).StenoChat && (window as any).StenoChat.open) {
                (window as any).StenoChat.open()
            }
        }
    }

    return (
        <main className="font-sans">
            {/* Debug info - remove in production */}
            {typeof window !== 'undefined' && (
                <div className="bg-gray-800 text-white text-xs p-2">
                    <div>Debug: Cookies = {document.cookie || 'none'}</div>
                    <div>Debug: Oura connected = {isOuraConnected ? 'yes' : 'no'}</div>
                    <div>Debug: Current URL = {window.location.href}</div>
                </div>
            )}
            {showSuccessMessage && (
                <div className="bg-green-500 text-white px-4 py-3 text-center font-medium">
                    🎉 Successfully connected to Oura! Your health data is now available for personalized AI coaching.
                </div>
            )}
            <HeroBanner isOuraConnected={isOuraConnected} openChat={openChat} />
            <OuraIntegrationSection />
            <BenefitsSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTASection isOuraConnected={isOuraConnected} openChat={openChat} />
        </main>
    )
}

function HeroBanner({ isOuraConnected, openChat }: { isOuraConnected: boolean; openChat: () => void }) {
    return (
        <section className="bg-black text-white font-[400]">
            <div className="relative flex flex-col-reverse md:flex-row items-end h-[600px] md:h-[780px] bg-gradient-to-br from-purple-900 via-black to-blue-900 overflow-hidden p-6 md:p-16">
                <div className="z-10 w-full md:w-[800px]">
                    <span className="uppercase text-xs font-medium relative pl-4 before:content-[''] before:w-2 before:h-2 before:bg-white before:absolute before:left-0 before:top-[3px] before:rounded-full">
                        HEALTH × AI
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl leading-tight my-8">
                        Your Oura Ring data meets personalized AI coaching
                    </h1>
                    <p className="text-lg md:text-xl mb-8">
                        Connect your Oura Ring to unlock personalized health insights and AI-powered coaching.
                        Get tailored advice based on your sleep, activity, and recovery data—24/7.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {!isOuraConnected ? (
                            <>
                                <Link
                                    href="/auth/oura"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Connect Your Oura Ring
                                </Link>
                                <button
                                    onClick={openChat}
                                    className="border border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Try Without Oura Data
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={openChat}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                            >
                                Open Your Personalized AI Coach
                            </button>
                        )}
                    </div>
                </div>
                <div className="hidden md:block z-10 w-1/2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full w-64 h-64 mx-auto opacity-20 animate-pulse"></div>
                        <Activity className="w-64 h-64 mx-auto text-blue-400" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
        </section>
    )
}

function OuraIntegrationSection() {
    return (
        <section className="py-20 md:py-32 bg-white text-black">
            <div className="w-full max-w-[1500px] mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="uppercase text-xs font-medium relative pl-4 inline-block before:content-[''] before:w-2 before:h-2 before:bg-black before:absolute before:left-0 before:top-[3px] before:rounded-full">
                        Oura Integration
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mt-8 mb-8">
                        Your health data, your AI coach
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Heart Rate Variability</h3>
                        <p className="text-gray-600">Get insights on your recovery and stress levels based on your HRV patterns.</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Moon className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Sleep Optimization</h3>
                        <p className="text-gray-600">Receive personalized sleep recommendations based on your sleep stages and quality.</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Activity & Recovery</h3>
                        <p className="text-gray-600">AI-powered coaching for optimal training and recovery based on your readiness score.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

function BenefitsSection() {
    const benefits = [
        {
            icon: <User size={24} />,
            title: "Personalized Health Insights",
            description: "AI analyzes your unique Oura data patterns to provide tailored health recommendations.",
        },
        {
            icon: <Sun size={24} />,
            title: "24/7 Availability",
            description: "Get instant health coaching and insights whenever you need them—no scheduling required.",
        },
        {
            icon: <Zap size={24} />,
            title: "Data-Driven Decisions",
            description: "Make informed health choices backed by your actual biometric data and AI analysis.",
        },
        {
            icon: <Brain size={24} />,
            title: "Continuous Learning",
            description: "The AI learns from your data patterns to provide increasingly accurate recommendations.",
        },
        {
            icon: <Sparkles size={24} />,
            title: "Holistic Wellness",
            description: "Integrates sleep, activity, and recovery data for comprehensive health optimization.",
        },
        {
            icon: <Smartphone size={24} />,
            title: "Seamless Integration",
            description: "Automatically syncs with your Oura Ring—no manual data entry required.",
        },
    ]

    return (
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-24 md:py-32 text-black">
            <div className="w-full max-w-[1230px] mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="uppercase text-xs font-medium relative pl-4 inline-block before:content-[''] before:w-2 before:h-2 before:bg-black before:absolute before:left-0 before:top-[3px] before:rounded-full">
                        Key Benefits
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mt-8">
                        Your health data.
                        <br />Your AI coach.
                        <br />Unlimited insights.
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function HowItWorksSection() {
    return (
        <section className="py-24 md:py-32 bg-white text-black">
            <div className="w-full max-w-[1230px] mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="uppercase text-xs font-medium relative pl-4 inline-block before:content-[''] before:w-2 before:h-2 before:bg-black before:absolute before:left-0 before:top-[3px] before:rounded-full">
                        How it works
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mt-8 mb-8">
                        Three steps to personalized health AI
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                            1
                        </div>
                        <h3 className="text-2xl font-medium mb-4">Connect Your Oura</h3>
                        <p className="text-lg text-gray-600">
                            Securely connect your Oura Ring account to grant access to your health data.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                            2
                        </div>
                        <h3 className="text-2xl font-medium mb-4">AI Analyzes Your Data</h3>
                        <p className="text-lg text-gray-600">
                            Our AI processes your sleep, activity, and recovery patterns to understand your unique health profile.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                            3
                        </div>
                        <h3 className="text-2xl font-medium mb-4">Get Personalized Coaching</h3>
                        <p className="text-lg text-gray-600">
                            Chat with your AI coach for data-driven insights, recommendations, and health optimization strategies.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

function TestimonialsSection() {
    const testimonials = [
        {
            comment: "Having my Oura data integrated with AI coaching is game-changing. The insights are so much more relevant to my actual health patterns.",
            name: "Sarah M.",
        },
        {
            comment: "Finally, an AI that understands my sleep patterns and recovery needs. The recommendations actually work because they're based on MY data.",
            name: "Mike R.",
        },
        {
            comment: "The personalized sleep optimization advice based on my Oura data helped me improve my recovery score by 30% in just two weeks.",
            name: "Jennifer L.",
        },
    ]

    return (
        <section className="bg-black text-white py-24 md:py-32">
            <div className="w-full max-w-[1230px] mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="uppercase text-xs font-medium relative pl-4 inline-block before:content-[''] before:w-2 before:h-2 before:bg-white before:absolute before:left-0 before:top-[3px] before:rounded-full">
                        Success Stories
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mt-8">
                        Real results from real users
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-900 p-8 rounded-2xl">
                            <div className="flex mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} fill="#FFD700" color="#FFD700" size={20} />
                                ))}
                            </div>
                            <p className="text-lg mb-6">&ldquo;{testimonial.comment}&rdquo;</p>
                            <p className="font-medium">— {testimonial.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function CTASection({ isOuraConnected, openChat }: { isOuraConnected: boolean; openChat: () => void }) {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 md:py-32">
            <div className="w-full max-w-[1230px] mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-8">
                    Ready to optimize your health with AI?
                </h2>
                <p className="text-xl md:text-2xl mb-12 opacity-90">
                    {isOuraConnected
                        ? "Your Oura Ring is connected. Start chatting with your personalized AI health coach now."
                        : "Connect your Oura Ring and start getting personalized health insights today."
                    }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!isOuraConnected ? (
                        <>
                            <Link
                                href="/auth/oura"
                                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                            >
                                Connect Your Oura Ring
                            </Link>
                            <button
                                onClick={openChat}
                                className="border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                            >
                                Try Without Oura Data
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={openChat}
                            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
                        >
                            Open Your AI Health Coach
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

// Add missing Moon component
function Moon({ className, ...props }: { className?: string; [key: string]: any }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
        </svg>
    )
}