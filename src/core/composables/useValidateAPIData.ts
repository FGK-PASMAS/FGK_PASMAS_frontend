import { APIError } from "@/core/errors/APIError";
import { ErrorToast } from "@/core/toasts/ErrorToast";
import type { ToastServiceMethods } from "primevue/toastservice";

/**
 * Check if API request was successful.
 * 
 * @param promise API request promise
 * @param toast PrimeVue toast service
 * @param errorMessage Custom error message (Optional)
 * @returns promise
 * @throws APIError and display error toast
 */
export async function useValidateAPIData(
    promise: Promise<any> | Promise<any>[] | APIError,
    toast: ToastServiceMethods,
    errorMessage?: string | undefined
): Promise<any> {
    const data = await promise;

    if (data instanceof APIError) {
        toast.add(new ErrorToast({ 
            summary: data.Type, 
            detail: errorMessage ?? data.Message 
        }));
        
        throw data;
    }

    return promise;
}
