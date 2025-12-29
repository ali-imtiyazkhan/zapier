
"use client"
import { LinkButton } from './button/Linkbutton'
import { useRouter } from 'next/navigation'

const Appbar = () => {

  const router = useRouter()
  return (
    <div className='flex border-b justify-between  text-black'>

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


        <LinkButton onClick={() => {
          router.push("/signup")
        }}>Sign Up</LinkButton>

      </div>

    </div>
  )
}

export default Appbar