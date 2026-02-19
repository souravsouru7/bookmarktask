'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useMemo, useState } from 'react'
import BookmarkForm from './BookmarkForm'
import BookmarkList from './BookmarkList'

type Bookmark = {
    id: string
    title: string
    url: string
    user_id: string
    created_at: string
}

export default function BookmarkManager({ initialBookmarks, userId }: { initialBookmarks: Bookmark[]; userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = useMemo(() => createClient(), [])

    useEffect(() => {
        const channel = supabase
            .channel(`realtime:bookmarks:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    // Removing strict filter to ensure we receive events
                },
                (payload) => {
                    console.log('Realtime change received:', payload)

                    // Client-side filtering
                    // For INSERT, payload.new has user_id
                    if (payload.eventType === 'INSERT' && payload.new && (payload.new as any).user_id !== userId) {
                        return
                    }



                    

                    if (payload.eventType === 'INSERT') {
                        console.log('Received INSERT event:', payload.new)
                        setBookmarks((prev) => {
                            // Check if already exists (optimistic update)
                            // With client-side ID, this is a perfect match check
                            if (prev.some((b) => b.id === payload.new.id)) {
                                console.log('Bookmark already exists, ignoring realtime event')
                                return prev
                            }
                            console.log('Adding bookmark from realtime event')
                            return [payload.new as Bookmark, ...prev]
                        })
                    } else if (payload.eventType === 'DELETE') {
                        console.log('Processing DELETE for ID:', payload.old.id)
                        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                    }
                }
            )
            .subscribe((status) => {
                console.log('Realtime subscription status:', status)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, userId])

    const handleAdd = async (title: string, url: string) => {
        // Optimistic Update with Client-Side ID
        const newId = crypto.randomUUID()
        const newBookmark: Bookmark = {
            id: newId,
            title,
            url,
            user_id: userId,
            created_at: new Date().toISOString(),
        }

        console.log('Adding bookmark optimistically:', newBookmark)
        setBookmarks((prev) => {
            const updated = [newBookmark, ...prev]
            console.log('Bookmarks after optimistic update:', updated)
            return updated
        })

        const { error } = await supabase
            .from('bookmarks')
            .insert([{ id: newId, title, url, user_id: userId }])

        if (error) {
            console.error('Error adding bookmark:', error)
            alert(`Error adding bookmark: ${error.message}`)
            // Revert on error
            setBookmarks((prev) => prev.filter((b) => b.id !== newId))
        } else {
            console.log('Bookmark added successfully to database')
        }
    }

    const handleDelete = async (id: string) => {
        // Optimistic Update
        const previousBookmarks = [...bookmarks]
        setBookmarks((prev) => prev.filter((b) => b.id !== id))

        const { error } = await supabase.from('bookmarks').delete().eq('id', id)

        if (error) {
            console.error('Error deleting bookmark:', error)
            alert('Error deleting bookmark')
            // Revert on error
            setBookmarks(previousBookmarks)
        }
    }

    return (
        <div className="space-y-8">
            <BookmarkForm onAdd={handleAdd} />
            <BookmarkList bookmarks={bookmarks} onDelete={handleDelete} />
        </div>
    )
}
