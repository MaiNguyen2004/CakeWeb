import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

const Selector = () => {
    const [tags, setTags] = useState([
        "Sô-cô-la",
        "Dâu tây",
        "Trà xanh",
        "Vani",
    ]);

    const [selected, setSelected] = useState(["Sô-cô-la"]);
    const [newTag, setNewTag] = useState("");

    const toggleTag = (tag) => {
        if (selected.includes(tag)) {
            setSelected(selected.filter((t) => t !== tag));
        } else {
            setSelected([...selected, tag]);
        }
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag("");
        }
    };

    return (
        <div className="mt-4">
            <label className="font-semibold">Nhãn hương vị</label>
            <div className="flex mt-1 gap-2">
                {tags.map((tag) => {
                    const isActive = selected.includes(tag);

                    return (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition
                ${isActive
                                    ? "bg-blue-100 text-blue-600 border-blue-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                                }`}
                        >
                            {isActive && <FaCheck size={14} />}
                            {tag}
                        </button>
                    );
                })}

                {/* Add new tag */}
                <div className="flex items-center gap-1">
                    <input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="+ Thêm nhãn"
                        className="px-3 py-1.5 text-sm rounded-full border border-gray-200 outline-none focus:ring-1 focus:ring-blue-300"
                    />
                    <button
                        onClick={addTag}
                        className="flex items-center gap-2 text-sm px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                        <FaPlus /> Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Selector;