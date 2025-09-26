"use client"

import { useEffect } from 'react'

export default function ChatPage() {
    useEffect(() => {
        // Add class to hide scrollbars on the body when chat is open
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    return (
        <div className="fixed inset-0 w-full h-full">
            <iframe
                src="https://devinchat.steno.ai/?id=devin-ai-SxIFG3&mode=fullscreen"
                className="w-full h-full border-0"
                allow="microphone; camera"
                title="Steno Chat"
            />
        </div>
    )
}