import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const res = await fetch(process.env.API_BASE_URL + "/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { message: "Failed to logout", error: err },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error during logout", error: error.message },
      { status: 500 }
    );
  }
}
