import router from '@/router/Index'

/**
 * Redirects the user based on their role after login.
 */
export function redirectAfterLogin(user) {
  if (!user) {
    console.error('User role not found. Redirecting to default page.')
    router.push('/auth/login') // Redirect to home or default route if role is not defined
    return
  }

  if (user.roles[0] === 'admin') {
    router.push('/admin/dashboard') // Redirect to admin dashboard
  } else if (user.roles[0] === 'quote') {
    router.push('/quote/dashboard') // Redirect to quote dashboard
  } else {
    console.error('Unknown user role. Redirecting to default page.')
    //router.push('/auth/route') // Redirect to home or default route for unknown roles
    router.push('/auth/route') // Redirect to home or default route for unknown roles
  }
}
