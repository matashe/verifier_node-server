import axios from 'axios'

export const getAuthToken = async (code: string) => {
  // Define the Azure token URL
  const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

  // Get the Azure credentials from environment variables
  const clientId = process.env.AZURE_CLIENT_ID
  const clientSecret = process.env.AZURE_CLIENT_SECRET
  const redirectUri = process.env.AZURE_REDIRECT_URI

  // If any of the Azure credentials is missing, throw an error
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Azure credentials not found. Check, if you have set the environment variables'
    )
  }

  // Create a URLSearchParams object to include in body of request
  const urlFormData = new URLSearchParams()
  urlFormData.append('client_id', clientId)
  urlFormData.append('scope', 'user.read openid offline_access')
  urlFormData.append('code', code)
  urlFormData.append('grant_type', 'authorization_code')
  urlFormData.append('client_secret', clientSecret)
  urlFormData.append('redirect_uri', redirectUri)

  // Send a POST request to Azure token endpoint
  const response = await axios.post(tokenUrl, urlFormData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  // If the response status is not 200, throw an error
  if (response.status !== 200) {
    throw new Error('Failed to get Azure token')
  }

  // Return the response data
  return response.data
}

export const getScope = async (token: string) => {
  // Define the Azure user info URL
  const userInfoUrl = 'https://graph.microsoft.com/v1.0/me'

  // Send a GET request to Azure user info endpoint
  const response = await axios.get(userInfoUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // If the response status is not 200, throw an error
  if (response.status !== 200) {
    throw new Error('Failed to get Azure user info')
  }

  // Return the response data
  return response.data
}
