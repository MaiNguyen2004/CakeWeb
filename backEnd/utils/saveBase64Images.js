import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const saveBase64Image = (base64String) => {
    try {
        // tách data
        const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);

        if (!matches) {
            throw new Error("Invalid base64 image");
        }

        const ext = matches[1].split("/")[1]; // png, jpeg
        const data = matches[2];

        const buffer = Buffer.from(data, "base64");

        // tạo tên file unique
        const fileName = `${uuidv4()}.${ext}`;

        const uploadPath = path.join("uploads", fileName);

        // tạo folder nếu chưa có
        if (!fs.existsSync("uploads")) {
            fs.mkdirSync("uploads");
        }

        fs.writeFileSync(uploadPath, buffer);

        return fileName;
    } catch (error) {
        console.error("Save image error:", error);
        return null;
    }
};