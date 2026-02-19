'use client'

type Bookmark = {
    id: string
    title: string
    url: string
    user_id: string
    created_at: string
}

type BookmarkListProps = {
    bookmarks: Bookmark[]
    onDelete: (id: string) => void
}

export default function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
    console.log('BookmarkList rendering with bookmarks:', bookmarks.length)
    
    return (
        <div className="space-y-4">
            {!bookmarks || bookmarks.length === 0 ? (
                <p className="text-center text-gray-500">No bookmarks yet. Add one above!</p>
            ) : (
                bookmarks.map((bookmark) => (
                    <div
                        key={bookmark.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="min-w-0 flex-1">
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block truncate text-lg font-medium text-blue-600 hover:underline"
                            >
                                {bookmark.title}
                            </a>
                            <p className="truncate text-sm text-gray-500">{bookmark.url}</p>
                        </div>
                        <button
                            onClick={() => onDelete(bookmark.id)}
                            className="ml-4 rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none"
                            title="Delete Bookmark"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                ))
            )}
        </div>
    )
}
