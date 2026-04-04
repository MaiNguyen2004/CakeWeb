import { useState, useEffect, useRef } from "react";
import ErrorMessage from "./ErrorMessage";

export default function ImageUploader({ onChange, error, value = [] }) {
    const imagesRef = useRef([]);
    const [images, setImages] = useState([]); // 🔥 lưu cả string + File
    const [errors, setErrors] = useState({});

    const MAX_SIZE = 20 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png"];

    // 🔥 sync dữ liệu từ ngoài (Update)
    useEffect(() => {
        if (value && value.length > 0) {
            const mapped = value.map(file => {
                // ảnh từ DB (string)
                if (typeof file === "string") {
                    return file;
                }
                // nếu đã có preview thì giữ nguyên
                if (file.preview) return file;

                // nếu là string (ảnh cũ)
                if (typeof file === "string") return file;

                // 🔥 nếu là File thì tạo preview
                return {
                    file,
                    preview: URL.createObjectURL(file)
                };
            });

            setImages(mapped);
            imagesRef.current = mapped;
        }
    }, [value]);
    console.log("VALUE:", value);
    console.log("IMAGES:", images);
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
        const newImages = images.filter((_, i) => i !== index);

        setImages(newImages);
        imagesRef.current = newImages;

        onChange(
            newImages.map(img => {
                if (typeof img === "string") return img;
                return img.file;
            })
        );
    };

    const processImages = (files) => {
        let errorList = [];

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

        if (errorList.length > 0) {
            setErrors({ images: errorList.join(", ") });
            return;
        }

        // 🔥 tạo object chứa cả file + preview URL
        const mappedFiles = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        const newImages = [...imagesRef.current, ...mappedFiles].slice(0, 6);

        setImages(newImages);
        imagesRef.current = newImages;

        onChange(
            newImages.map(img => {
                if (typeof img === "string") return img;
                return img.file;
            })
        );
    };

    const getImageSrc = (img) => {
        if (!img) return "";

        // 🔥 base64 (data:image/...)
        if (typeof img === "string" && img.startsWith("data:image")) {
            return img;
        }

        // 🔥 ảnh từ server
        if (typeof img === "string") {
            return `http://localhost:5000/uploads/${img}`;
        }

        // 🔥 file mới
        return img.preview;
    };
    useEffect(() => {
        return () => {
            images.forEach(img => {
                if (img.preview) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, [images]);

    return (
        <>
            {/* input */}
            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="uploadImage"
                onChange={handleImageChange}
            />

            {/* drop zone */}
            <div
                onClick={() =>
                    document.getElementById("uploadImage").click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer"
            >
                <h5 className='font-bold'>Kéo thả ảnh vào đây</h5>
                <p className="text-xs">JPG, PNG (tối đa 20MB)</p>
            </div>

            <ErrorMessage message={error || errors.images} />

            {/* preview */}
            <div className="flex gap-2 mt-4 flex-wrap">
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="w-32 h-32 bg-gray-100 border-2 rounded-lg overflow-hidden relative group"
                    >
                        <img
                            src={getImageSrc(img)}
                            alt="preview"
                            className="w-full h-full object-cover"
                        />

                        <button
                            onClick={() => handleRemove(i)}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}