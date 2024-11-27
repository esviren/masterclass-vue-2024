import type { AuthError } from '@supabase/supabase-js'

export const useFormErrors = () => {
  const serverError = ref('')

  const handelServerError = (error: AuthError) => {
    serverError.value =
      error.message === 'Invalid login credentials' ? 'Incorrectemail or password' : error.message
  }

  return {
    serverError,
    handelServerError,
  }
}
