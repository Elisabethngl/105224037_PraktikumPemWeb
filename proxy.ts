import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pemeriksaan optimistik: hanya memeriksa keberadaan cookie 'sesi' di boundary routing
export function proxy(request: NextRequest) {
  if (!request.cookies.has("sesi")) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }
  return NextResponse.next();
}

// Alias untuk Next.js standard middleware convention
export const middleware = proxy;

export const config = {
  matcher: ["/katalog/tambah"],
};
