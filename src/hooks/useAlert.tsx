import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const useAlert = () => {
  const confirmAction = async (title: string, text: string = "You won't be able to revert this!") => {
    const result = await MySwal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)", // Tailwind red-500
      cancelButtonColor: "var(--color-secondary)",  // Tailwind slate-500
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "px-6 py-2 rounded-lg ml-3",
        cancelButton: "px-6 py-2 rounded-lg",
      },
    });

    return result.isConfirmed;
  };

  // সাকসেস মেসেজ
  const successAlert = (title: string, message: string = "") => {
    MySwal.fire({
      title,
      text: message,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: "rounded-2xl",
      },
    });
  };

  const errorAlert = (title: string, message: string = "Something went wrong!") => {
    MySwal.fire({
      title,
      text: message,
      icon: "error",
      confirmButtonColor: "var(--color-secondary)", // Tailwind blue-500
      customClass: {
        popup: "rounded-2xl",
      },
    });
  };

  return { confirmAction, successAlert, errorAlert };
};