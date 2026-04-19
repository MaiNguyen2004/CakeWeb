export const formatDateVN = (date) => {
    if (!date) return "Chưa có";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "Không hợp lệ";

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day} tháng ${month}, ${year}`;
};