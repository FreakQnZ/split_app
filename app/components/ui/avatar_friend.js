import React from 'react'

const Avatar = ({ username, DeleteFriend, currentUser }) => {

    const start = username[0].toUpperCase() + username[1].toUpperCase();

    return (
        <main className='flex flex-col items-center p-10'>
            <div className="bg-neutral text-neutral-content w-24 rounded-full flex h-24 items-center justify-center">
                <span className="text-3xl">{start}</span>
            </div>
            <span className='text-2xl p-4'>{username}</span>
            <button
                onClick={() => DeleteFriend(username, currentUser)}
                className="btn btn-sm"
                aria-label="Delete friend"
            >
                Remove
            </button>
        </main>
    )
}

export default Avatar
