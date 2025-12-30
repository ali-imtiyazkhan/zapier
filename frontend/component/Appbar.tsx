
"use client"
import { LinkButton } from './button/Linkbutton'
import { useRouter } from 'next/navigation'
import { PrimaryButton } from './button/PrimaryButton'

const Appbar = () => {

  const router = useRouter()
  return (
    <div className='flex border-b items-center justify-between  bg-[#2f2a26] text-white'>

      <div>
        <div>
          Zapier
        </div>

      </div>

      <div className='text-sm flex justify-between gap-5'>

        <LinkButton onClick={() => { }}>Contect Sales</LinkButton>


        <LinkButton onClick={() => {
          router.push("/login")
        }}> Login</LinkButton>


        <PrimaryButton size='lg' onClick={() => {
          router.push("/signup")
        }}>Sign Up</PrimaryButton>

      </div>

    </div>
  )
}

export default Appbar