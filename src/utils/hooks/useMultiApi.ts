import { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { flattenObject } from "../functions/flattenObject";
import axiosInstance from "../axios/axsionInstance";

export const HttpMethod = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    PATCH: "patch"
} as const;

export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];

interface EndpointConfig {
    endPoint: string;
    method?: HttpMethod;
    version?: string;
    payload?: any;
    validation?: yup.Schema;
    navigateTo?: string;
    withOutToast?: boolean;
    page_key?: string;
}

export function useMultiApi<T>() {
    const [returnedData, setReturnedData] = useState<Record<string, T | null | any>>({});
    const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();

    const initializeEndpoint = (endpointName: string) => {
        setReturnedData(prev => ({ ...prev, [endpointName]: null }));
        setErrors(prev => ({ ...prev, [endpointName]: {} }));
        setLoading(prev => ({ ...prev, [endpointName]: false }));
    };

    const fetchData = async (endpointName: string, config: EndpointConfig | Record<string, any>, customPayload?: any) => {
        const { 
            endPoint, 
            method = HttpMethod.GET, 
            validation, 
            version, 
            navigateTo, 
            page_key 
        } = config;
        
        const payload = customPayload || config.payload;

        setLoading(prev => ({ ...prev, [endpointName]: true }));
        setErrors(prev => ({ ...prev, [endpointName]: {} }));

        try {
            if (validation) await validation.validate(payload, { abortEarly: false });
            
            const response = await axiosInstance({
                method,
                url: `/${import.meta.env.VITE_API_APP_TYPE}/${import.meta.env.VITE_API_VERSION || version}/${endPoint}`,
                data: payload,
                headers: {
                    "page-key": page_key,
                    "X-Api-Key": `${import.meta.env.VITE_API_KEY}`,
                }
            });

            setReturnedData(prev => ({ ...prev, [endpointName]: response.data.data }));
            
            if (navigateTo) {
                navigate(navigateTo);
            }
            
            return response;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || "An error occurred";
            const backEndValidationError = err?.response?.data?.errors || err?.response?.data?.message || {};
            
            if (err.inner) {
                // Yup validation errors
                const validationErrors: Record<string, string> = {};
                err.inner.forEach((error: any) => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(prev => ({ ...prev, [endpointName]: validationErrors }));
            } else {
                if (err.response?.status === 403) {
                    navigate("/forbidden");
                } else {
                    setErrors(prev => ({
                        ...prev,
                        [endpointName]: flattenObject(backEndValidationError)
                    }));
                    
                    if (err?.response?.status !== 401) {
                        console.error(errorMessage);
                    }
                }
            }
            return err;
        } finally {
            setLoading(prev => ({ ...prev, [endpointName]: false }));
        }
    };

    const initializeEndpoints = (configs: Record<string, EndpointConfig>) => {
        Object.keys(configs).forEach(endpointName => {
            initializeEndpoint(endpointName);
        });
    };

    return { 
        returnedData, 
        errors, 
        loading, 
        fetchData, 
        initializeEndpoints,
        setErrors: (endpointName: string, errors: Record<string, string>) => {
            setErrors(prev => ({ ...prev, [endpointName]: errors }));
        }
    };
}



// Example For Usage 
// const { data, errors, loading, fetchData, initializeEndpoints } = useMultiApi();
// 
// Initialize endpoints when component mounts
// useEffect(() => {
//     initializeEndpoints({
//         'home': {
//             endPoint: "home",
//             method: HttpMethod.GET,
//         },
//     });

//     fetchData('home', {
//         endPoint: "home",
//         method: HttpMethod.GET
//     });
// }, []);
// 

