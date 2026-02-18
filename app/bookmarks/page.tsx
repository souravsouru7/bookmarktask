import BookmarkManager from '@/components/BookmarkManager'
import LogoutButton from '@/components/LogoutButton'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function BookmarksPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If user is not logged in, redirect to login page
    if (!user) {
        return redirect('/login')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-2xl px-4">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:inline-block">{user.email}</span>
                        <LogoutButton />
                    </div>
                </header>

                <main>
                    <BookmarkManager initialBookmarks={bookmarks || []} userId={user.id} />
                </main>
            </div>
        </div>
    )
}
