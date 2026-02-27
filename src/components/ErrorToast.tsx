import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export const toastError = (err: any) => {
  const error = err as AxiosError;

  if (error.response?.data) {
    toast.error(error.response?.data as string);
  } else {
    toast.error("Something went wrong");
  }
};

export const toastSuccess = (data: any) => {
  if (data) {
    toast.success(data);
  }
};
