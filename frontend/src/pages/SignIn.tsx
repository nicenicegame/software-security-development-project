function SignIn() {
  function onSubmitSignInForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <div>
      <h1 className="font-medium text-3xl my-4">Sign In</h1>
      <form className="flex flex-col" onSubmit={onSubmitSignInForm}>
        <label>Username</label>
        <input
          type="text"
          className="my-2 border border-slate-300 bg-white px-3 py-2 focus:outline-none rounded-md"
        />
        <label>Password</label>
        <input
          type="text"
          className="my-2 border border-slate-300 bg-white px-3 py-2 focus:outline-none rounded-md"
        />
        <button type="submit" className="self-start my-2">
          Submit
        </button>
      </form>
    </div>
  )
}

export default SignIn
