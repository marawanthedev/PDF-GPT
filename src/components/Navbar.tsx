import Link from "next/link";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import {
  getKindeServerSession,
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";

export const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLoggedIn = await isAuthenticated();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            {" "}
            PDF-GPT{" "}
          </Link>
          {/* todo add mobile navbar */}
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>

              {!isLoggedIn && (
                <>
                  {" "}
                  <LoginLink
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    {" "}
                    Sign in{" "}
                  </LoginLink>
                  <RegisterLink
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    {" "}
                    Get Started <ArrowRight className="h-5 w-5 ml-1.5" />{" "}
                  </RegisterLink>
                </>
              )}
              {isLoggedIn && (
                <LogoutLink
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Logout
                </LogoutLink>
              )}
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
