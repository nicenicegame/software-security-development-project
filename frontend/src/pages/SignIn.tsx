import { useForm, SubmitHandler } from 'react-hook-form'
import { ISignInFormData } from '../types'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { reset, signIn, signInWithGoogle } from '../features/auth/authSlice'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import Spinner from '../components/Spinner'

const schema = yup
  .object({
    email: yup
      .string()
      .email('Not a valid email.')
      .required('Please enter your email.'),
    password: yup
      .string()
      .min(12, 'Password must be at least 12 characters.')
      .required('Please enter your password.')
  })
  .required()

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISignInFormData>({
    resolver: yupResolver(schema)
  })

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, message, isSuccess, isLoading, isError } = useAppSelector(
    (state) => state.auth
  )
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/')
    }

    if (isSuccess) {
      toast.success(message)
      dispatch(reset())
    }

    if (isError) {
      toast.error(message)
      dispatch(reset())
    }
  }, [user, message, isSuccess, isError, dispatch, navigate])

  const onSubmitSignInForm: SubmitHandler<ISignInFormData> = async (data) => {
    await dispatch(
      signIn({
        email: data.email,
        password: data.password
      })
    )
  }

  return (
    <>
      {isLoading && <Spinner />}
      <div>
        <h1 className="font-medium text-3xl my-4">Sign In</h1>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log(credentialResponse)
            if (credentialResponse.credential) {
              dispatch(signInWithGoogle(credentialResponse.credential))
            }
          }}
          onError={() => {
            console.log('Error')
          }}
        />
        <div className="my-4 relative flex items-center justify-center after:absolute after:w-full after:h-1 after:bg-slate-200 after:top-1/2 after:left-0 after:-z-10">
          <p className="px-3 bg-white">Or</p>
        </div>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmitSignInForm)}>
          <label>Email</label>
          <input
            {...register('email')}
            type="text"
            className={`my-2 px-3 py-2 input-field ${
              errors.email && 'invalid'
            }`}
          />
          <p className="text-pink-600 mb-2">{errors.email?.message}</p>
          <label>Password</label>
          <input
            {...register('password')}
            type={isPasswordShown ? 'text' : 'password'}
            className={`my-2 px-3 py-2 input-field ${
              errors.password && 'invalid'
            }`}
          />
          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              onChange={(e) => setIsPasswordShown(e.target.checked)}
            />
            <label>Show password</label>
          </div>
          <p className="text-pink-600 mb-2">{errors.password?.message}</p>
          <button
            type="submit"
            className="self-start my-2 py-2 px-3 bg-teal-500 text-white rounded-md">
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default SignIn
