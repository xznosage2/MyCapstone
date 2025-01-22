import User from "@/models/IUsers";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const users = await User.find({});
        return NextResponse.json(users);
    } catch (err: any) {
        return NextResponse.json({ error: err.message })
    }
}

export async function POST(request: NextRequest) {
    try {
        const {username,password} = await request.json()
        await dbConnect();
        const result = await User.create({username,password})

        return NextResponse.json({
            message: "User created successfully",
            sucess: 201,
            result
        });
    } catch (err) {
        console.log(err);
        return NextResponse.json({message:err},{status:500});
    }
}

export async function DELETE(request:NextRequest) {
    const id =request.nextUrl.searchParams.get('id');
    await dbConnect();
    await User.findByIdAndDelete(id);
    return NextResponse.json({message:"User deleted"},{status:200})
}
