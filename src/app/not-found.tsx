import React from 'react'

export default function notFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <p className="text-sm uppercase tracking-widest text-[#72585a]">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-[#594043]">The page you requested does not exist.</p>
      </div>
    </main>
  )
}
