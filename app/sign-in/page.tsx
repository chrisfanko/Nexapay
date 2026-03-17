"use client"
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import Link from 'next/link'
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlert, Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
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
      router.push("/");
      toast.success("Login successful")
    } else if (res?.status === 401) {
      setError("Invalid Credentials")
      setPending(false);
    } else {
      setError("Something went wrong")
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
    <div className='h-full flex items-center bg-blue-200 justify-center'>
      <Card className='md:h-auto w-[80%] sm:p-8 p-4 sm:w-105'>
        <CardHeader>
          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-sm text-center text-accent-foreground'></CardDescription>
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
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password field with toggle */}
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                disabled={pending}
                placeholder='Password'
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
              Continue
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
            Create new account
            <Link href="sign-up" className='text-sky-700 ml-4 hover:underline cursor-pointer'>Sign Up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn;