import Toast from 'react-native-toast-message';

type ToastHandler = (title: string, message: string) => void;

let registeredErrorHandler: ToastHandler | null = null;
let registeredSuccessHandler: ToastHandler | null = null;

/**
 * Registers global toast handlers from the ToastContext.
 */
export const registerToastHandlers = (handlers: {
    showError: ToastHandler;
    showSuccess: ToastHandler;
}) => {
    registeredErrorHandler = handlers.showError;
    registeredSuccessHandler = handlers.showSuccess;
};

/**
 * Centralized error handler for API requests.
 * Displays a toast message and logs the error to the console.
 * @param error The error object caught in the catch block.
 * @param title The title for the toast message (default: "Error").
 */
export const handleError = (error: any, title: string = 'Error') => {
    console.error(`${title}:`, error);

    let message = 'Something went wrong. Please try again later.';

    if (error?.message) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }

    if (registeredErrorHandler) {
        registeredErrorHandler(title, message);
    } else {
        Toast.show({
            type: 'error',
            text1: title,
            text2: message,
        });
    }
};

/**
 * Centralized success handler for API requests.
 * @param message The success message.
 * @param title The title for the toast (default: "Success").
 */
export const handleSuccess = (message: string, title: string = 'Success') => {
    if (registeredSuccessHandler) {
        registeredSuccessHandler(title, message);
    } else {
        Toast.show({
            type: 'success',
            text1: title,
            text2: message,
        });
    }
};
