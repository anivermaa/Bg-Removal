// import React, { useContext, useEffect } from 'react';
// import { assets } from '../assets/assets-1/assets';
// import { Link } from 'react-router-dom';
// import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
// import { AppContext } from '../context/appContext';

// const Navbar = () => {
//   const { openSignIn } = useClerk();
//   const { isSignedIn, user } = useUser(); // ✅ useUser for auth state
//   const { credits, loadCreditsData } = useContext(AppContext); // ✅ fixed useContext import

//   useEffect(() => {
//     if (isSignedIn) {
//       loadCreditsData();
//     }
//   }, [isSignedIn]);

//   return (
//     <div className="flex justify-between items-center mx-4 py-3 lg:mx-44">
//       <Link to="/">
//         <img className="w-32 sm:w-44" src={assets.logo} alt="logo" />
//       </Link>

//       {isSignedIn ? (
//         <div className="flex items-center gap-4">
//           <p className="text-sm">Credits: {credits}</p> {/* ✅ show credits */}
//           <UserButton />
//         </div>
//       ) : (
//         <button
//           onClick={() => openSignIn({})}
//           className="bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full"
//         >
//           Get started
//           <img className="w-4 sm:w-4" src={assets.arrow_icon} alt="arrow" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Navbar;








import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets-1/assets';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import { AppContext } from '../context/appContext';









// import React from 'react'
// import { assets } from '../assets/assets-1/assets'
// import { Link } from 'react-router-dom'
// import { useClerk, UserButton } from '@clerk/clerk-react'
// import { AppContext } from '../context/appContext'
// import { use } from 'react'
// import { useEffect } from 'react'

const Navbar = () => {

  const { openSignIn } = useClerk();
  const {isSignedIn,user }=useClerk();
  const {credits, loadCreditsData}=useContext(AppContext)

  const navigate = useNavigate()

  useEffect( () => {
     if (isSignedIn){
      loadCreditsData()
     }
      
    },[isSignedIn])
  


  return (
    <div className='flex justify-between items-center mx-4 py-3 lg:mx-44'>
      <Link to="/"><img className='w-32 sm:w-44' src={assets.logo} alt=""/></Link>
      {
        isSignedIn
        ?<div className='flex items-center gap-2 sm:gap-3'>
          <button onClick={()=>navigate('/buy')} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700'>
            <img className='w-5' src={assets.credit_icon} alt="" />
            <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits :{credits}</p>
          </button>
          <p className='text-gray-600 max-sm:hidden'>Hi, {user.fullName}</p>
          <UserButton />

        </div>
        :<button onClick={() => openSignIn({})} className='bg-zinc-800 text-white flex items-center gap-4x px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full'>
        Get started <img className='w-4 sm:w-4' src={assets.arrow_icon} alt=""/>
      </button>
      }
      
    </div>
  )
}

export default Navbar
