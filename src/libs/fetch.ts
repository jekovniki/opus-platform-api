import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default class FetchAPI {
    public static async get(url: string, configuration: AxiosRequestConfig = {}): Promise<AxiosResponse<any, any>> {

        return axios.get(url, configuration);
    }

    public static async post(url: string, data: any, configuration: AxiosRequestConfig = {}): Promise<AxiosResponse<any, any>> {
        
        return axios.post(url, data, configuration);
    }
}