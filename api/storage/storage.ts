import { db, storage } from '@/config/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytesResumable } from 'firebase/storage';

export interface IUserFile {
    id?: string;
    name: string;
    url: string;
    size: number;
    type: string;
    createdAt: any;
    path: string;
    uid: string;
}

/**
 * Uploads a file to Firebase Storage and stores metadata in Firestore
 * @param blob The file blob to upload
 * @param fileName Original name of the file
 * @param uid User ID
 * @param onProgress Callback for upload progress
 */
export const uploadFile = (
    blob: Blob,
    fileName: string,
    uid: string,
    onProgress?: (progress: number) => void
): Promise<IUserFile> => {
    return new Promise((resolve, reject) => {
        const fileExtension = fileName.split('.').pop();
        const storagePath = `users/${uid}/files/${Date.now()}_${fileName}`;
        const storageRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const metadata = await getMetadata(uploadTask.snapshot.ref);

                    const fileData: IUserFile = {
                        name: fileName,
                        url: downloadURL,
                        size: metadata.size,
                        type: metadata.contentType || 'unknown',
                        createdAt: serverTimestamp(),
                        path: storagePath,
                        uid: uid
                    };

                    // Store metadata in Firestore for easier listing
                    const docRef = await addDoc(collection(db, 'user_files'), fileData);

                    resolve({ ...fileData, id: docRef.id });
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

/**
 * Fetches the list of files for a user from Firestore
 * @param uid User ID
 */
export const getUserFiles = async (uid: string): Promise<IUserFile[]> => {
    try {
        const q = query(collection(db, 'user_files'), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        const files: IUserFile[] = [];
        querySnapshot.forEach((doc) => {
            files.push({ id: doc.id, ...doc.data() } as IUserFile);
        });

        return files.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (error) {
        console.error("Error fetching user files:", error);
        throw error;
    }
};

/**
 * Deletes a file from both Storage and Firestore
 * @param fileId Firestore document ID
 * @param storagePath Path in Firebase Storage
 */
export const deleteFile = async (fileId: string, storagePath: string): Promise<void> => {
    try {
        // Delete from Storage
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);

        // Delete from Firestore
        await deleteDoc(doc(db, 'user_files', fileId));
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};