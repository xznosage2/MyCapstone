import dbConnect from "@/lib/dbConnect";
import User from "../../../models/Interfaces/IUser"

import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    const { id } = params;
    const { newName: username, newPassword: password } = await request.json();
    await dbConnect();
    await User.findByIdAndUpdate(id, { username, password })
    return NextResponse.json({ mesage: "User updated" }, { status: 200 })
}

export async function GET(request, { params }) {
    const { username } = params;
    await dbConnect();
    try {
        console.log(username); 
        const user = await User.findOne({ username: username });
        return NextResponse.json({ user }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message })
    }

}
