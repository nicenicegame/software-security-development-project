import { useForm, SubmitHandler } from 'react-hook-form'
import { ISignUpFormData } from '../types'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { reset, signUpUser } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useMemo } from 'react'
import Spinner from '../components/Spinner'
import { FaCheckCircle } from 'react-icons/fa'

const schema = yup
  .object({
    name: yup.string().required('Please enter your name.'),
    email: yup
      .string()
      .email('Not a valid email.')
      .required('Please enter your email.'),
    password: yup
      .string()
      .min(12, 'Password must be at least 12 characters.')
      .required('Please enter your password.'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Your passwords do not match.')
      .required('Please retype your password.')
  })
  .required()

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch
  } = useForm<ISignUpFormData>({
    resolver: yupResolver(schema)
  })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, message, isSuccess, isLoading, isError } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (user) {
      navigate('/')
    }

    if (isSuccess) {
      toast.success(message)
      dispatch(reset())
      navigate('/sign-in')
    }

    if (isError) {
      toast.error(message)
      dispatch(reset())
    }
  }, [user, message, isSuccess, isError, dispatch, navigate])

  const password = watch('password')

  const passwordState = useMemo(() => {
    if (password?.length) {
      const lengthError = password.length < 12
      const digitError = /\d/.test(password) === false
      const uppercaseError = /[A-Z]/.test(password) === false
      const lowercaseError = /[a-z]/.test(password) === false
      const symbolError =
        /[!@#$%&'()*+,-./[\\\]^_`{|}~"+r'"]/.test(password) === false
      const passwordOk =
        lengthError ||
        digitError ||
        uppercaseError ||
        lowercaseError ||
        symbolError
      return {
        passwordOk,
        lengthError,
        digitError,
        uppercaseError,
        lowercaseError,
        symbolError
      }
    }
  }, [password])

  const onSubmitSignUpForm: SubmitHandler<ISignUpFormData> = async (data) => {
    if (passwordState?.passwordOk === true) {
      await trigger('password')
      return
    }
    await dispatch(
      signUpUser({
        name: data.name,
        email: data.email,
        password: data.password
      })
    )
  }

  return (
    <>
      {isLoading && <Spinner />}
      <div>
        <h1 className="font-medium text-3xl my-4">Sign Up</h1>
        <div className="grid grid-cols-2 gap-x-10">
          <form
            className="flex flex-col"
            onSubmit={handleSubmit(onSubmitSignUpForm)}>
            <label>Name</label>
            <input
              {...register('name')}
              type="text"
              className={`my-2 px-3 py-2 input-field ${
                errors.name && 'invalid'
              }`}
            />
            <p className="text-pink-600 mb-2">{errors.name?.message}</p>
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
              type="password"
              className={`my-2 px-3 py-2 input-field ${
                (errors.password || passwordState?.passwordOk === true) &&
                'invalid'
              }`}
            />
            <p className="text-pink-600 mb-2">
              {errors.password?.message}
              {errors.password?.message === undefined &&
                passwordState?.passwordOk === true &&
                'Password not met the requirements'}
            </p>
            <label>Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className={`my-2 px-3 py-2 input-field ${
                errors.confirmPassword && 'invalid'
              }`}
            />
            <p className="text-pink-600 mb-2">
              {errors.confirmPassword?.message}
            </p>
            <button
              type="submit"
              className="self-start my-2 py-2 px-3 bg-teal-500 text-white rounded-md">
              Submit
            </button>
          </form>
          <div>
            <div
              className={`p-3 border rounded-md ${
                passwordState?.passwordOk === false
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}>
              <h5 className="font-semibold mb-2">Password requirements</h5>
              <ul>
                <li className="flex gap-x-1 items-center">
                  {passwordState?.lengthError === false && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                  12 characters length or more
                </li>
                <li className="flex gap-x-1 items-center">
                  {passwordState?.digitError === false && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                  1 digit or more
                </li>
                <li className="flex gap-x-1 items-center">
                  {passwordState?.symbolError === false && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                  1 symbol or more
                </li>
                <li className="flex gap-x-1 items-center">
                  {passwordState?.uppercaseError === false && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                  1 uppercase letter or more
                </li>
                <li className="flex gap-x-1 items-center">
                  {passwordState?.lowercaseError === false && (
                    <FaCheckCircle className="text-green-500" />
                  )}
                  1 lowercase letter or more
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
