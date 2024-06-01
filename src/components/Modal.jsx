import React, { useEffect, useRef } from 'react'

export default function Modal({open, close, btnText, btnFn,  info, children}) {
    const dialog = useRef()
    useEffect(() => {
        if(open) {
            dialog.current.showModal()
        } else {
            dialog.current.close()
        }
    }, [open])

  return (
    <dialog className='modal' ref={dialog} onClose={close}>
        {children}
        <div className="modal-actions">
            {!info && <button onClick={close} className='text-button'>close</button>}
            <button className='button' onClick={btnFn}>{btnText}</button>
        </div>
    </dialog>
  )
}
