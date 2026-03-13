import { NextResponse, type NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  // Auth middleware disabled for preview/demo mode.
  // To re-enable Supabase auth protection, uncomment below:
  //
  // import { updateSession } from "@/lib/supabase/middleware";
  // return await updateSession(request);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
