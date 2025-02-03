import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Form that registers a user.
 */
export function SignUpForm() {
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
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = await res.json();
      console.log('Registered', user);
      console.log(
        `You can check the database with: psql -d userManagement -c 'select * from users'`
      );
      alert(
        `Successfully registered ${user.username} as userId ${user.userId}.`
      );
      navigate('/sign-in');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    }
  }

  return (
    <div className="container" style={{ fontFamily: 'Nova Round' }}>
      <div className="">
        <div className="align-center justify-self-center text-xl p-4">
          <h1>Register</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="">
            <label className="">
              Username:
              <input
                required
                name="username"
                type="text"
                style={{ backgroundColor: '#F6F5FF' }}
                // className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              />
            </label>
            <label className="margin-bottom-1 d-block">
              Password:
              <input
                required
                name="password"
                type="password"
                style={{ backgroundColor: '#F6F5FF' }}
                // className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              />
            </label>
            <br></br>
            <br></br>
          </div>
        </div>
        <div className="row">
          <div className="column-full d-flex justify-between">
            <button
              style={{ backgroundColor: '#eaf585' }}
              className="flex justify-items-center justify-self-center border border-gray-300 rounded py-1 px-3 mx-10 mb-5 p-4">
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
