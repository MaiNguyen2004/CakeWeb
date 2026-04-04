export const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
        // Nếu img đã là string thì trả về luôn
        if (typeof file === "string") {
            resolve(file);
            return;
        }

        if (!(file instanceof Blob)) {
            reject(new Error("Không phải File/Blob"));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
};