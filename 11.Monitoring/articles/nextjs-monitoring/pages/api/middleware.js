import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();
  console.log("-->middleware");
  return response;
}

export const config = {
  matcher: "/hello",
};
