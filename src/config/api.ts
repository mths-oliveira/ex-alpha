import axios from "axios"

export const api = axios.create({
  validateStatus: null,
  baseURL: "https://economia.awesomeapi.com.br/json/last/",
})
