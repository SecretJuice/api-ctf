import { randomToken } from '../util'
import { getSecrets } from '../gameSecrets'
import { directoryData } from '../directoryData'
import { clientRegistryData } from '../clientsData'
import { clientCredentials } from '../clientsData'
import { requestPrototype } from './requestPrototype'

const secrets = getSecrets()
const targetEmplid = secrets.adminEmplid
const targetToken = secrets.adminBearerToken
/*
 * endpoints: /directory, /clients, /vault, /token
 * /directory: optional query parameter id, no auth token needed
 * /clients: optional query parameter id, needs auth token
 * /vault: no query parameters, needs auth token
 * /token: no query parameters, no auth token needed, POST, -u id:secret, -d grant_type=client_credentials
 */
// convert directoryData keys to array
const directoryIds = Array.from(directoryData.keys())
const directoryRequestPrototype = {
  ...requestPrototype,
  http_request: {
    ...requestPrototype.http_request,
    path: '/directory',
    method: 'GET',
    query: ''
  }
}
export const directoryRequests = [
  {
    ...directoryRequestPrototype,
    http_request: {
      ...directoryRequestPrototype.http_request,
      query: 'id=' + directoryIds[0]
    }
  },
  {
    ...directoryRequestPrototype,
    http_request: {
      ...directoryRequestPrototype.http_request,
      query: ''
    }
  },
  {
    ...directoryRequestPrototype,
    http_request: {
      ...directoryRequestPrototype.http_request,
      query: 'id=' + directoryIds[1]
    }
  }
].sort(() => Math.random() - 0.5)

export const targetLog = {
  ...requestPrototype,
  http_request: {
    ...requestPrototype.http_request,
    headers: {
      ...requestPrototype.http_request.headers,
      authorization: 'Bearer ' + targetToken
    },
    method: 'GET',
    path: '/clients',
    query: 'emplid=' + targetEmplid
  },
  http_response: {
    ...requestPrototype.http_response,
    size: 2116,
    status: 200,
    text_status: 'OK',
    took: 14843
  }
}
const clientIds = Array.from(clientRegistryData.keys())
const clientsRequestPrototype = {
  ...requestPrototype,
  http_request: {
    ...requestPrototype.http_request,
    headers: {
      ...requestPrototype.http_request.headers,
      authorization: 'Bearer ' + randomToken()
    },
    path: '/clients',
    method: 'GET',
    query: 'id=' + clientIds[0]
  },
  http_response: {
    ...requestPrototype.http_response,
    status: 401,
    text_status: 'Unauthorized'
  }
}
export const clientsRequests = [targetLog, clientsRequestPrototype].sort(() => Math.random() - 0.5)
const vaultRequestPrototype = {
  ...requestPrototype,
  http_request: {
    ...requestPrototype.http_request,
    headers: {
      ...requestPrototype.http_request.headers,
      authorization: 'Bearer ' + randomToken()
    },
    path: '/vault',
    method: 'GET',
    query: ''
  },
  http_response: {
    ...requestPrototype.http_response,
    status: 401,
    text_status: 'Unauthorized'
  }
}
export const vaultRequests = [vaultRequestPrototype]
const tokenRequestPrototype = {
  ...requestPrototype,
  http_request: {
    ...requestPrototype.http_request,
    path: '/token',
    method: 'POST',
    query: '',
    body: {
      grant_type: 'client_credentials'
    }
  }
}
const clientIdLength = clientCredentials[0].clientId.length
const clientSecretLength = clientCredentials[0].secret.length
export const tokenRequests = [
  {
    ...tokenRequestPrototype,
    http_request: {
      ...tokenRequestPrototype.http_request,
      headers: {
        ...tokenRequestPrototype.http_request.headers,
        authorization:
          'Basic ' +
          Buffer.from(clientCredentials[0].clientId + ':' + clientCredentials[0].secret).toString(
            'base64'
          )
      }
    }
  },
  {
    ...tokenRequestPrototype,
    http_request: {
      ...tokenRequestPrototype.http_request,
      headers: {
        ...tokenRequestPrototype.http_request.headers,
        authorization:
          'Basic ' +
          Buffer.from(
            randomToken().substring(0, clientIdLength) +
              ':' +
              randomToken().substring(0, clientSecretLength)
          ).toString('base64')
      }
    },
    http_response: {
      ...requestPrototype.http_response,
      status: 401,
      text_status: 'Unauthorized'
    }
  }
].sort(() => Math.random() - 0.5)
