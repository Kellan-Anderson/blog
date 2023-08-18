'use client'

import axios, { Axios, AxiosResponse } from "axios";
import { useState } from "react";

function isAxiosResponse(res: Response | AxiosResponse): res is AxiosResponse {
  return (res as AxiosResponse).data !== undefined
}

export default function usePromise(options: {
  promiseFn: () => Promise<Response | AxiosResponse>,
  onSuccess?: (data?: any) => void,
  onError?: (err?: Error) => void
}) {

  const [error, setError] = useState<Error>();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const callFn = () => {
    setIsLoading(true);
    options
      .promiseFn()
      .then(res => {
        if(isAxiosResponse(res)) return res.data()
        else return res.json()
      })
      .then(res => {
        setData(res);
        options.onSuccess?.(res);
      })
      .catch((err) => {
        setError(err);
        options.onError?.(err);
      })
      .finally(() => setIsLoading(false))
  }

  return {
    error,
    data,
    isLoading,
    callFn
  };
}