import React from 'react'

function Input({ id, label, name, type }) {
  return (
    <>
    <label htmlFor={id}>{label}</label>
    <input type={type} id={id} name={name} required />
    </>
  )
}

export default Input