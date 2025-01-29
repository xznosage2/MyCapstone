"use server"

import { SignupFormSchema, FormState } from '@/lib/definitions'
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { createSession } from '../lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signup(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { username, password } = validatedFields.data!
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const jsonData = Object.fromEntries(formData.entries());
        const result = await fetch('http://localhost:3000/api/users', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ username, password: hashedPassword })
        });
        const userData = await result.json();
        if (userData.success === 201) {
            const user = userData.result;
            await createSession(user._id);
            return { redirect: 'http://localhost:3000/MyPage' };
        } else {
            console.log("Failed to create user:", userData.message);
            return {
                errors: { username: ['Failed to create user'], password: [] },
                message: userData.message || 'An error occurred while creating your account.',
            };
        }
    } catch (error) {
        const err = error as Error;
        console.log(err);
        return { errors: { username: [], password: [] }, message: err.message };
    }
}
export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}
export async function logout() {
    deleteSession();
    return redirect("/Login");
    //return NextResponse.redirect('http://localhost:3000/Login');
}
export async function login(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { username, password } = validatedFields.data!
    console.log(username); 
    try {
        const jsonData = Object.fromEntries(formData.entries());
        const result = await fetch(`http://localhost:3000/api/users/${username}`, {
            method: "GET",
        });
        const userData = await result.json();
        if (userData.success === 201) {
            const passwordCheck = await bcrypt.compare(password, userData.password);
            if (passwordCheck) {
                const user = userData.result;
                await createSession(user._id);
                return redirect("/MyPage");
            } else {
                console.log("Incorrect Password:", userData.message);
                return {
                    errors: { username: [], password: ["Incorrect Password"] },
                    message: userData.message || 'Please input the correct password.',
                };
            }
        } else {
            console.log("No User with that Username:", userData.message);
            return {
                errors: { username: ['Failed to find user with this username'], password: [] },
                message: userData.message || 'An error occurred while finding your account.',
            };
        }
    } catch (error) {
        const err = error as Error;
        console.log(err);
        return { errors: { username: [], password: [] }, message: err.message };
    }

}
