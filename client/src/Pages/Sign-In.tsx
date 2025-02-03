import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { Link } from 'react-router-dom';

/**
 * Form that signs in a user.
 */
export function SignIn() {
  const { handleSignIn } = useUser();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      console.log(res);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = await res.json();
      console.log(user);
      handleSignIn(user, token);
      console.log('Signed In', user);
      console.log('Received token:', token);
      navigate('/');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <div className="container " style={{ fontFamily: 'Nova Round' }}>
      <div className="">
        <div className="align-center justify-self-center text-xl p-4">
          <h1>Sign In</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="">
            <label className="justify-self-center">
              Username:
              <input
                required
                name="username"
                type="text"
                style={{ backgroundColor: '#F6F5FF' }}
                // className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              />
            </label>
            <label className="margin-bottom-1 d-block justify-self-center">
              Password:
              <input
                required
                name="password"
                type="password"
                style={{ backgroundColor: '#F6F5FF' }}
                // className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              />
              <br></br>
              <br></br>
            </label>
          </div>
        </div>
        <button
          style={{ backgroundColor: '#eaf585' }}
          className="flex justify-items-center justify-self-center border border-gray-300 rounded py-1 px-3 mx-10 mb-5 p-4">
          Sign In
        </button>
        <div className="justify-self-center">
          <Link
            className=" align-middle underline"
            style={{ color: '#705DCC' }}
            to="/sign-up">
            Not registered? Sign up for an account
          </Link>
        </div>
      </form>
    </div>
  );
}
