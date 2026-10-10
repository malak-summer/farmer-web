import { useEffect, useRef, useState } from 'react'

const SecurityCheck = ({ siteKey, onToken, resetKey }) => {
  const container = useRef(null)
  const tokenCallback = useRef(onToken)
  const [error, setError] = useState('')
  useEffect(() => { tokenCallback.current = onToken }, [onToken])
  useEffect(() => {
    if (!siteKey || typeof document === 'undefined') return
    let active = true
    let widget
    const fail = () => { if (active) { setError('Security check could not load. Reload this page to try again.'); tokenCallback.current('') } }
    const render = () => {
      if (!active || !window.turnstile || !container.current) return
      setError('')
      widget = window.turnstile.render(container.current, {
        sitekey: siteKey, action: 'contact', size: 'compact',
        callback: token => { if (active) tokenCallback.current(token) },
        'expired-callback': () => { if (active) tokenCallback.current('') },
        'error-callback': fail,
      })
    }
    let script = document.getElementById('turnstile-script')
    if (window.turnstile) render()
    else {
      if (!script) {
        script = document.createElement('script')
        script.id = 'turnstile-script'
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        document.head.appendChild(script)
      }
      script.addEventListener('load', render)
      script.addEventListener('error', fail)
    }
    return () => {
      active = false
      script?.removeEventListener('load', render)
      script?.removeEventListener('error', fail)
      if (widget !== undefined) window.turnstile?.remove(widget)
    }
  }, [siteKey, resetKey])
  return <div><div ref={container} /><p role="status" className="text-sm text-primary-brown">{error}</p></div>
}

export default SecurityCheck
