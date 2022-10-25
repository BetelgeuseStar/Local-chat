import React from 'react'

export interface ButtonProps {
	children: React.ReactNode
	className?: string
	[key: string]: any
}

function Button({ children, className = '', ...props }: ButtonProps) {
	return (
		<div className={className + ' btn'} {...props}>{children}</div>
	)
}

export default Button