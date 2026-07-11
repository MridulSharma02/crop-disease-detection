const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export async function detectDisease(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  let response: Response

  try {
    response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error('Cannot connect to server. Please make sure the backend is running.')
  }

  if (response.status === 500) {
    throw new Error('Model is still loading. Please wait a few minutes and try again.')
  }

  if (!response.ok) {
    throw new Error('Prediction failed. Please try again.')
  }

  const data = await response.json()
  return data
}