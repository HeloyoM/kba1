import { IMessage } from '@/app/(tabs)/messages';
import React from 'react'
import { Modal } from 'react-native'

interface AdminMessageFormProps {
    onClose: () => void;
    onSubmit: (message: Partial<IMessage>) => void;
    visible: boolean;
}

const AdminMessageForm = (props: AdminMessageFormProps) => {
    const { visible } = props
    return (
        <Modal visible={visible} transparent animationType="fade">

        </Modal>
    )
}

export default AdminMessageForm