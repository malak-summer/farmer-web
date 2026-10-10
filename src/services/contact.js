// Transport only. Validation and receipt/UI state remain in the Contact component.
export async function requestContact(payload) {
  const response = await fetch('/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(25000),
  })
  if (response.status === 429) throw new Error('Too many attempts. Please wait a minute before trying again. Your input has been kept.')
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Contact is temporarily unavailable. Delivery is not confirmed and your input has been kept.')
  let result
  try { result = await response.json() } catch { throw new Error('The service returned an invalid response. Delivery is not confirmed. Your input has been kept.') }
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('The service returned an invalid response. Delivery is not confirmed. Your input has been kept.')
  if (!response.ok) throw new Error(result.error || 'Submission could not be confirmed. Please try again later.')
  return result
}
