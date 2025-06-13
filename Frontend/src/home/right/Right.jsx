import React from 'react'
import Chatuser from './Chatuser'
import Messages from './Messages'
import Type from './Type'

function Right() {
  return (
    <>
    <div className='w-[70%]  bg-slate-950 text-white'>
    <Chatuser></Chatuser>
    <div className='py-2 overflow-y-auto flex-gayatri' style= {{maxHeight:"calc(88vh - 10vh )"}}>
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 
      <Messages></Messages> 

      </div>
    <Type></Type>
    </div>
     
    </>
  )
}

export default Right