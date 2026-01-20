import { registerToastHandlers } from '@/api/error-handler';
import React, { createContext, useCallback, useContext, useEffect } from 'react';
import Toast, { BaseToast, ErrorToast, InfoToast, ToastShowParams } from 'react-native-toast-message';

const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{ height: 'auto', minHeight: 60, borderLeftColor: '#69C779', paddingVertical: 10 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600'
            }}
            text2Style={{
                fontSize: 14,
                color: '#666'
            }}
            text1NumberOfLines={0}
            text2NumberOfLines={0}
        />
    ),
    error: (props: any) => (
        <ErrorToast
            {...props}
            style={{ height: 'auto', minHeight: 60, borderLeftColor: '#FE6301', paddingVertical: 10 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600'
            }}
            text2Style={{
                fontSize: 14,
                color: '#666'
            }}
            text1NumberOfLines={0}
            text2NumberOfLines={0}
        />
    ),
    info: (props: any) => (
        <InfoToast
            {...props}
            style={{ height: 'auto', minHeight: 60, borderLeftColor: '#1B998B', paddingVertical: 10 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600'
            }}
            text2Style={{
                fontSize: 14,
                color: '#666'
            }}
            text1NumberOfLines={0}
            text2NumberOfLines={0}
        />
    )
};

interface ToastContextProps {
    showSuccess: (text1: string, text2?: string) => void;
    showError: (text1: string, text2?: string) => void;
    showInfo: (text1: string, text2?: string) => void;
    show: (params: ToastShowParams) => void;
    hide: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const show = useCallback((params: ToastShowParams) => {
        Toast.show(params);
    }, []);

    const hide = useCallback(() => {
        Toast.hide();
    }, []);

    const showSuccess = useCallback((text1: string, text2?: string) => {
        Toast.show({
            type: 'success',
            text1,
            text2,
        });
    }, []);

    const showError = useCallback((text1: string, text2?: string) => {
        Toast.show({
            type: 'error',
            text1,
            text2,
        });
    }, []);

    const showInfo = useCallback((text1: string, text2?: string) => {
        Toast.show({
            type: 'info',
            text1,
            text2,
        });
    }, []);

    useEffect(() => {
        registerToastHandlers({
            showError,
            showSuccess,
        });
    }, [showError, showSuccess]);

    const value = {
        showSuccess,
        showError,
        showInfo,
        show,
        hide,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast config={toastConfig} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
