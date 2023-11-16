import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiConfig } from "../config/api.config";

export default function api(
    path: string, //putanja
    method: 'get' | 'post' | 'patch' | 'delete', //metodi koje koristimo
    body: any, //telo sadrzaja koji treba da saljemo (moze ali i ne mora)
) {
    //logika koju treba da obavlja
    return new Promise<ApiResponse>((resolve) => {
        const requestData = {
            method: method,
            url: path, //putanja koja predstavlaja mesto gde se upucuje nas request 
            baseURL: ApiConfig.API_URL, //api.config.ts napravili smo const oja sadrzi putanju
            data: body ? JSON.stringify(body) : undefined, //mora ga prebacimo u JSON
            headers: { // za autorizaciju koristimo headers
                'Content-Type': 'application/json',
                'Authorization': getToken(),
            },
        }
    })
}

export interface ApiResponse {
    status: 'ok' | 'error' | 'login';
    data: any;
}

async function responseHandler(
    res: AxiosResponse<any>,
    resolve: (value: ApiResponse ) => void,
) {
    /* imamo dva slucaja:
        1. kada je problem do servera
        2. kada je problem u aplikaciji
    */

    if(res.status < 200 || res.status >= 300) { //HTTP error statusi
        const response: ApiResponse = {
            status: 'error',
            data: res.data,
            
        }  
        
        return resolve(response);
    }

    if(res.data.statusCode < 0) {
        let response: ApiResponse;

        if(res.status === 401) {
            response = {
                status: 'login',
                data: null,
            }; 
            return resolve(response);
        } else {
            response = {
                status: 'ok',
                data: res,
            };
        }
        return resolve(response);
    }

    resolve(res.data);
}

// izvukli info o tokenu
function getToken(): string {
    const token = localStorage.getItem('api_token'); //izvlacimo token
    return 'Berer ' + token;
}
 
export function saveToken(token: string) {
    localStorage.setItem('api_token', token);
}

function getRefreshToken():string {
    const token = localStorage.getItem('api_refresh_token');
    return token + '';
}

export function saveRefreshToken(token: string) {
    localStorage.setItem('api_refresh_token', token);
}

async function refreshToken(): Promise<string | null> {
    const path = 'auth/user/refresh';
    const data = {
        token: getRefreshToken(),
    }

    const refreshTokenRequestData = {
        method: 'post',
        url: path,
        baseURL: ApiConfig.API_URL,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const rtr: { data: {token: string | undefined}} = await axios(refreshTokenRequestData);

    if(!rtr.data.token) {
        return null;
    }
    
    return rtr.data.token;
}

async function repeatRequest(
    requestData: AxiosRequestConfig,
    resolve: (value: ApiResponse) => void
){
    axios(requestData)
    .then(res => {
        let response: ApiResponse;

        if(res.status === 401) {
            response = {
                status: 'login',
                data: null,
            }; 
            return resolve(response);
        } else {
            response = {
                status: 'ok',
                data: res,
            };
        }
        return resolve(response);
    })
    .catch(err => {
        const response: ApiResponse = {
            status: 'error',
            data: err,
        };
        resolve(response);
    });
}