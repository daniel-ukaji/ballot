import Link from 'next/link'
import React from 'react'
// import { Icons } from './Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/services/AuthContext';
// import { getAuthSession } from '@/lib/auth'
// import UserAccountNav from './UserAccountNav'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
 import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Navbar() {
  const { user, logout } = useAuth();
  const { setTheme } = useTheme()



//   const session = await getAuthSession()

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2'>
        <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
            {/* logo */}
            <Link href='/' className='flex gap-2 items-center'>
              {/* <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' /> */}
              <p className=' text-zinc-700 text-sm font-medium'>
                CEMCS
              </p>
            </Link>

            <div className='flex items-center space-x-8'>
                <Link href='/'>Home</Link>
                {/* <Link href='/upload'>Upload</Link>
                <Link href='/ballotresultspage'>Draw</Link> */}
                {user ? (
                <Button onClick={logout} >Log Out</Button>
                ) : (
                <Link href='/signin' className={buttonVariants()} >Sign In</Link>
                )}
                {/* <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> */}
            </div>


            {/* Search Bar
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ): (
              <Link href='/sign-in' className={buttonVariants()} >Sign In</Link>
            )} */}
        </div>
    </div>
  )
}

export default Navbar