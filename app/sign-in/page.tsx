"use client"
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import Link from 'next/link'
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlert, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SignIn = () => {
  const t = useTranslations("auth");
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true);

    const res = await signIn('credentials', {
      redirect: false,
      password,
      email
    })

    if (res?.ok) {
      const session = await getSession();
      const role = session?.user?.role;
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      toast.success(t("signIn.success"))
    } else if (res?.status === 401) {
      setError(t("signIn.invalidCredentials"))
      setPending(false);
    } else {
      setError(t("signIn.error"))
      setPending(false);
    };
  }

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" });
  }

  return (
    <div className='min-h-screen flex flex-col bg-blue-200'>
      {/* Back to Home button */}
      <div className='p-4'>
        <Link
          href="/"
          className='inline-flex items-center gap-2 text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          {t("backHome")}
        </Link>
      </div>

      {/* Centered form */}
      <div className='flex-1 flex items-center justify-center'>
        <Card className='md:h-auto w-[80%] sm:p-8 p-4 sm:w-105'>
          <CardHeader>
            <CardTitle className='text-center'>{t("signIn.title")}</CardTitle>
            <CardDescription className='text-sm text-center text-accent-foreground' />
          </CardHeader>

          {!!error && (
            <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
              <TriangleAlert />
              <p>{error}</p>
            </div>
          )}

          <CardContent className='px-2 sm:px-6'>
            <form onSubmit={handleSubmit} className='space-y-3'>
              <Input
                type='email'
                disabled={pending}
                placeholder={t("signIn.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  disabled={pending}
                  placeholder={t("signIn.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              <Button className='w-full' size="lg" disabled={pending}>
                {t("signIn.continue")}
              </Button>
            </form>

            <Separator />

            <div className='flex my-2 justify-evenly mx-auto items-center'>
              <Button
                disabled={false}
                onClick={(e) => handleProvider(e, "google")}
                variant="outline"
                size="lg"
                className='bg-slate-300 hover:bg-slate-400 hover:scale-110'
              >
                <FcGoogle className='size-8 left-2.5 top-2.5' />
              </Button>
              <Button
                disabled={false}
                onClick={(e) => handleProvider(e, "github")}
                variant="outline"
                size="lg"
                className='bg-slate-300 hover:bg-slate-400 hover:scale-110'
              >
                <FaGithub className='size-8 left-2.5 top-2.5' />
              </Button>
            </div>

            <p>
              {t("signIn.noAccount")}
              <Link href="sign-up" className='text-sky-700 ml-4 hover:underline cursor-pointer'>
                {t("signIn.signUp")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignIn;