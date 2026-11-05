// React usage adapter. Install React in the consuming app and load styles/app.css once.
import type { ButtonHTMLAttributes } from 'react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { appearance?: 'strong' | 'regular' | 'outlined' | 'borderless'; busy?: boolean };
export function Button({appearance='strong',busy=false,disabled,children,className='',...props}:Props) {
 return <button {...props} type={props.type ?? 'button'} disabled={disabled || busy} aria-busy={busy || undefined} className={`pl-button pl-button--${appearance} pl-button--lg ${className}`}>{children}{busy && <span> — in progress</span>}</button>;
}
