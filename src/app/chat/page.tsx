"use client"

import { useEffect, useState } from 'react'

export default function ChatPage() {
    const [chatVersion, setChatVersion] = useState<'preview' | 'login'>('preview')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    useEffect(() => {
        // Add class to hide scrollbars on the body when chat is open
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    const chatUrls = {
        preview: 'https://chat.steno.ai/?id=devin-ai-SxIFG3-preview&mode=fullscreen',
        login: 'https://chat.steno.ai/?id=devin-ai-SxIFG3&mode=fullscreen'
    }

    return (
        <div className="fixed inset-0 w-full h-full">
            {/* Dropdown toggle button - hidden in top-right corner */}
            <div className="absolute top-2 right-2 z-50">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="px-3 py-1 bg-gray-800/80 text-white text-xs rounded hover:bg-gray-700/80 transition-colors"
                >
                    {chatVersion === 'preview' ? 'Preview' : 'Login'} ▼
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 bg-gray-800 rounded shadow-lg border border-gray-700 overflow-hidden">
                        <button
                            onClick={() => {
                                setChatVersion('preview')
                                setIsDropdownOpen(false)
                            }}
                            className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition-colors ${
                                chatVersion === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                        >
                            Preview (No Login)
                        </button>
                        <button
                            onClick={() => {
                                setChatVersion('login')
                                setIsDropdownOpen(false)
                            }}
                            className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-700 transition-colors ${
                                chatVersion === 'login' ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                        >
                            Login Version (Testing)
                        </button>
                    </div>
                )}
            </div>

            <iframe
                src={chatUrls[chatVersion]}
                className="w-full h-full border-0"
                allow="microphone; camera"
                title="Steno Chat"
            />
        </div>
    )
}