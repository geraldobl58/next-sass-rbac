import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    // Redirect to sign-in page if the user is not authenticated
    // This is a server-side check, so it will not render the children if the user is not authenticated
    // This is useful for protecting routes that require authentication
    // You can also use a client-side check with a context or a hook if needed
    // For example, you can use a context to check if the user is authenticated and redirect
    return redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
