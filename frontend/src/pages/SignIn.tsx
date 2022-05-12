import { useForm, SubmitHandler } from 'react-hook-form'
import { ISignInFormData } from '../types'

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISignInFormData>()

  const onSubmitSignInForm: SubmitHandler<ISignInFormData> = (data) => {}

  return (
    <div>
      <h1 className="font-medium text-3xl my-4">Sign In</h1>
      <form
        className="flex flex-col"
        onSubmit={handleSubmit(onSubmitSignInForm)}
      >
        <label>Email</label>
        <input
          {...register('email')}
          type="text"
          className="my-2 border border-slate-300 bg-white px-3 py-2 focus:outline-none rounded-md"
        />
        <label>Password</label>
        <input
          {...register('password')}
          type="text"
          className="my-2 border border-slate-300 bg-white px-3 py-2 focus:outline-none rounded-md"
        />
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

export default SignIn
