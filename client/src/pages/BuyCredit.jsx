import React from 'react'
import { assets,plans } from '../assets/assets-1/assets'
import { useContext } from 'react'
import { AppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'
import { useAuth ,useUser} from '@clerk/clerk-react'
import axios from 'axios'
import {toast} from 'react-toastify'

const BuyCredit = () => {

  const { backendUrl, loadCreditsData}= useContext(AppContext)

  const navigate = useNavigate()

  const {getToken} = useAuth()
  const {user} = useUser()

  const initPay = async (order) =>{

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Credits Payment',
      order_id: order.id,
      receipt:order.receipt,
      handler:async (response) =>{
        console.log(response)

        const token = await getToken()
        try {
          
          const {data} = await axios.post(backendUrl+'/api/user/verify-razor',response,{headers:{token}})
          if(data.success){
            loadCreditsData()
            navigate('/')
            toast.success('Credit Added')
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
          
        }
      }
    }
     const rzp = new window.Razorpay(options)
     rzp.open()
  }

  
const paymentRazorpay = async (planId) => {
  try {
    const token = await getToken();  // ✅ get Clerk JWT

    console.log("Sending to backend:", { planId, token });  // 👈 debug log

    const { data } = await axios.post(
      backendUrl + "/api/user/pay-razor",
      { planId }, 
      { headers: { token } }   // ✅ send token in headers
    );

    console.log("Backend response:", data);  // 👈 log server reply

    if (data.success) {
      initPay(data.order);
    }
  } catch (error) {
    console.log("Payment error:", error);
    toast.error(error.response?.data?.message || error.message);
  }
};





  return (
      <div className='min-h-[80vh] text-center pt-14 mb-10'>
        <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
        <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-6 sm:mb-10'>Choose the plan that's right for you</h1>
        <div className='flex flex-wrap justify-center gap-6 text-left'>
          {plans.map((item, index) => (
            <div className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-700' key={index}>
              <img width={40} src={assets.logo_icon} alt="" />
              <p className='mt-3 font-semibold'>{item.id}</p>
              <p className='text-sm'>{item.desc}</p>
              <p className='mt-6'>
                <span className='text-3xl font-medium'>${item.price}</span>/{item.credits} Credits
              </p>
              <button onClick={() => paymentRazorpay(item.id)} 
      className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'
>
  Purchase
</button>

              </div>
         
         ))}
        </div>
    </div>
  )
}

export default BuyCredit
