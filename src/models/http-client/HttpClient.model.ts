import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { HttpRequestParamsInterface } from './HttpRequestParams.interface'
import { HttpClientInterface } from './HttpClient.interface'
import { config } from '@/config'

/**
 * @name HttpClientModel
 * @description
 * It wraps the HTTP client functionality to avoid using a third-party package like Axios directly and thus
 * simplify its replacement in the future if said package is no longer maintained or for any other reason
 */

export class HttpClientModel implements HttpClientInterface {
  private getToken(): string{
    const TOKEN_KEY = config.httpClient.tokenKey || 'myapp-token'
    const token = localStorage.getItem(TOKEN_KEY) || ''
    return token
  }

  constructor() {
    // OPTIONAL for now: Add a request interceptor to handle errors 
    // or other things from a single place for each request
  }

  get<T>(parameters: HttpRequestParamsInterface): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { url, requiresToken } = parameters

      // axios options
      const options: AxiosRequestConfig = {
        headers: {}
      }

      if (requiresToken) {
        const token = this.getToken()
	options.headers.RequestVerificationToken = token
      }

      axios
        .get(url, options)
        .then((response: AxiosResponse) => {
	  resolve(response.data as T)
        })
        .catch((response: AxiosResponse) => {
          console.info('------ rejecting ----')
          reject(response)
        })
    })
  }

  post<T>(parameters: HttpRequestParamsInterface): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { url, requiresToken, payload } = parameters
      
      // axios options 
      const options: AxiosRequestConfig = {
        headers: {}
      }
      
      if (requiresToken) {
        const token = this.getToken()
	options.headers.RequestVerificationToken = token
      }

      axios
        .post(url, payload, options)
        .then((response: AxiosResponse) => {
          resolve(response.data as T)
        }).catch((response: AxiosResponse) => {
	  reject(response)
        })
    })
  }
}

