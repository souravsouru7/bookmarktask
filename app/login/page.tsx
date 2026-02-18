import LoginButton from '@/components/LoginButton'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
    const supabase = await createClient()
    
    const {
        data: { user },
    } = await supabase.auth.getUser()
    
    // If user is already logged in, redirect to bookmarks
    if (user) {
        return redirect('/bookmarks')
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to manage your bookmarks
                    </p>
                </div>
                <LoginButton />
            </div>
        </div>
    )
}
