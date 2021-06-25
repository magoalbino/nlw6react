import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
}

// rest operator: ...props (pega o resto dos objetos)
export function Button({ isOutlined = false, ...props }: ButtonProps) {  
  return (
    <button 
      className={`button ${isOutlined ? 'outlined' : ''}`} {...props} />
  )
}