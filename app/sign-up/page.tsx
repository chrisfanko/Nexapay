"use client"
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react'
import Link from 'next/link'
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TriangleAlert, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

const SignUp = () => {
  const t = useTranslations("auth");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const res = await fetch('api/auth/signup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setPending(false);
      toast.success(data.message);
      router.push('/sign-in');
    } else if (res.status === 400) {
      setError(data.message);
      setPending(false);
    }
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
            <CardTitle className='text-center'>{t("signUp.title")}</CardTitle>
            <CardDescription className='text-sm text-center text-accent-foreground'>
              {t("signUp.desc")}
            </CardDescription>
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
                type='text'
                disabled={pending}
                placeholder={t("signUp.fullName")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                type='email'
                disabled={pending}
                placeholder={t("signUp.email")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  disabled={pending}
                  placeholder={t("signUp.password")}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              <div className='relative'>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  disabled={pending}
                  placeholder={t("signUp.confirmPassword")}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  className='pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                </button>
              </div>
              <Button className='w-full' size="lg" disabled={pending}>
                {t("signUp.continue")}
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
              {t("signUp.hasAccount")}
              <Link href="sign-in" className='text-sky-700 ml-4 hover:underline cursor-pointer'>
                {t("signUp.signIn")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignUp;