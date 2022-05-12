import { useForm, SubmitHandler } from 'react-hook-form'
import { ISignUpFormData } from '../types'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup
  .object({
    email: yup
      .string()
      .email('Not a valid email.')
      .required('Please enter your email.'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters.')
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
    formState: { errors }
  } = useForm<ISignUpFormData>({
    resolver: yupResolver(schema)
  })

  const onSubmitSignUpForm: SubmitHandler<ISignUpFormData> = (data) => {
    console.log(data)
  }

  return (
    <div>
      <h1 className="font-medium text-3xl my-4">Sign Up</h1>
      <form
        className="flex flex-col"
        onSubmit={handleSubmit(onSubmitSignUpForm)}
      >
        <label>Email</label>
        <input
          {...register('email')}
          type="text"
          className={`my-2 px-3 py-2 input-field ${errors.email && 'invalid'}`}
        />
        <p className="text-pink-600 mb-2">{errors.email?.message}</p>
        <label>Password</label>
        <input
          {...register('password')}
          type="password"
          className={`my-2 px-3 py-2 input-field ${
            errors.password && 'invalid'
          }`}
        />
        <p className="text-pink-600 mb-2">{errors.password?.message}</p>
        <label>Confirm Password</label>
        <input
          {...register('confirmPassword')}
          type="password"
          className={`my-2 px-3 py-2 input-field ${
            errors.confirmPassword && 'invalid'
          }`}
        />
        <p className="text-pink-600 mb-2">{errors.confirmPassword?.message}</p>
        <button
          type="submit"
          className="self-start my-2 py-2 px-3 bg-teal-500 text-white rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default SignUp
