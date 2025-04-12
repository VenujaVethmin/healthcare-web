import { NextResponse } from "next/server";

export async function middleware(request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = new URL(request.url);
  const currentPath = url.pathname;

  // Get session cookie from request
  const sessionCookie = request.cookies.get("connect.sid");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Validate session with the backend
    const res = await fetch(`${backendUrl}/me`, {
      headers: {
        Cookie: `connect.sid=${sessionCookie.value}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = await res.json();
    console.log("User data:", user);

    if (!user.id) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Restrict access based on role
    if (currentPath.startsWith("/user") && user.role !== "PATIENT") {
      return unauthorizedResponse("This page is only for Patients.");
    }
    if (currentPath.startsWith("/doctor") && user.role !== "DOCTOR") {
      return unauthorizedResponse("This page is only for Doctors.");
    }
    if (currentPath.startsWith("/admin") && user.role !== "ADMIN") {
      return unauthorizedResponse("This page is only for Administrators.");
    }
     if (currentPath.startsWith("/pharmacist") && user.role !== "PHARMACIST") {
      return unauthorizedResponse("This page is only for Pharmacist.");
    }

    // Store user info in cookies for frontend access
    const response = NextResponse.next();
    response.cookies.set("userId", user.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

function unauthorizedResponse(message) {
  return new NextResponse(
    `<html>
      <head>
        <title>Unauthorized Access - Healthi</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #eafefa 0%, #ffffff 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .container {
            max-width: 450px;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 40px 32px;
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06),
              0 0 0 1px rgba(0, 0, 0, 0.05);
            text-align: center;
          }
          
          .icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 24px;
            background: #fee2e2;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          h1 {
            color: #232323;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          
          p {
            color: #82889c;
            font-size: 16px;
            line-height: 1.625;
            margin-bottom: 32px;
          }
          
          .buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          
          button {
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .back-button {
            background: #f8f9fa;
            color: #82889c;
            border: 1px solid #e2e2e2;
          }
          
          .back-button:hover {
            background: #e2e2e2;
          }
          
          .login-button {
            background: linear-gradient(135deg, #3a99b7 0%, #2d7a93 100%);
            color: white;
            border: none;
          }
          
          .login-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(58, 153, 183, 0.25);
          }
          
          a {
            text-decoration: none;
            color: inherit;
            display: flex;
            align-items: center;
            gap: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Unauthorized Access</h1>
          <p>${message}</p>
          <div class="buttons">
            <button onclick="history.back()" class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
            <button class="login-button">
              <a href="/login">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </a>
            </button>
          </div>
        </div>
      </body>
    </html>`,
    {
      status: 403,
      headers: { "Content-Type": "text/html" },
    }
  );
}

export const config = {
  matcher: ["/user/:path*", "/doctor/:path*", "/admin/:path*" , "/pharmacist/:path* "],
};
