function formatTimestamp(timestamp: number) {
    const dateObj = new Date(timestamp);
    const formattedDate = dateObj.toISOString().split('T')[0];
    const formattedTime = dateObj.toTimeString().split(' ')[0];

    return { formattedDate, formattedTime };
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export { formatFileSize, formatTimestamp };
