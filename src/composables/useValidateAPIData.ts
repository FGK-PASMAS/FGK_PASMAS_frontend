import { APIError } from "@/utils/errors/api.error";
import { ErrorToast } from "@/utils/toasts/error.toast";
import type { ToastServiceMethods } from "primevue/toastservice";

export async function useValidateAPIData(
    promise: Promise<any> | Promise<any>[] | APIError,
    toast: ToastServiceMethods,
    errorMessage?: string | undefined
): Promise<any>
{
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
