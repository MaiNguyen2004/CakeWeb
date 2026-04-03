import { useState, useEffect, useRef } from "react";
import ErrorMessage from "./ErrorMessage";

export default function ImageUploader({ onChange, error }) {
    const imagesRef = useRef([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [errors, setErrors] = useState({});

    const MAX_SIZE = 20 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png"];
    const handleImageChange = (e) => {
        setErrors({});
        const files = Array.from(e.target.files);
        processImages(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        processImages(files);
    };
    const handleRemove = (index) => {
        const newFiles = imagesRef.current.filter((_, i) => i !== index);

        const previews = newFiles.map(file => URL.createObjectURL(file));

        setPreviewImages(previews);
        imagesRef.current = newFiles;

        onChange(newFiles);
        setErrors({});
    };
    const processImages = (files) => {
        let errorList = []
        const validFiles = files.filter(file => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                errorList.push(`${file.name} sai định dạng`);
                return false;
            }

            if (file.size > MAX_SIZE) {
                errorList.push(`${file.name} > 20MB`);
                return false;
            }

            return true;
        });

        // 🔥 nếu có lỗi
        if (errorList.length > 0) {
            setErrors({ images: errorList.join(", ") });
            return;
        }
        const newFiles = [...(imagesRef.current || []), ...validFiles].slice(0, 6);

        const previews = newFiles.map(file => URL.createObjectURL(file));

        setPreviewImages(previews);
        imagesRef.current = newFiles;

        onChange(newFiles);
    };

    // tránh memory leak
    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    return (
        <>
            {/* input hidden */}
            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="uploadImage"
                onChange={handleImageChange}
            />

            {/* UI giữ nguyên */}
            <div
                onClick={() =>
                    document.getElementById("uploadImage").click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer"
            >
                <h5 className='font-bold'>Kéo thả ảnh vào đây</h5>
                <p className="text-xs">JPG, PNG (tối đa 5MB)</p>
            </div>
            <ErrorMessage message={error || errors.images} />

            {/* preview */}
            <div className="flex gap-2 mt-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative group"
                    >
                        {previewImages[i] && (
                            <>
                                <img
                                    src={previewImages[i]}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />

                                {/* Nút xoá */}
                                <button
                                    onClick={() => handleRemove(i)}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}