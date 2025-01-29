'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { signup } from '../../actions/AuthAction'

export function SignupForm() {
    const [state, action] = useActionState(signup, undefined)

    return (
        <form className=" flex flex-col gap-3" action={action}>
            <div>
                <label htmlFor="username">username</label>
                <input className="border border-slate-500 px-8 py-2" id="username" name="username" placeholder="username" />
            </div>
            {state?.errors?.username && <p>{state.errors.username}</p>}
            <div>
                <label htmlFor="password">Password</label>
                <input className="border border-slate-500 px-8 py-2" id="password" name="password" type="password" />
            </div>
            {state?.errors?.password && (
                <div>
                    <p>Password must:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <SubmitButton />
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} type="submit">
            Sign Up
        </button>
    )
}
