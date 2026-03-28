import api from "./api";


export const getRoleName = async () => {
    const res = await api.get("/roles/roleName");
    return res.data;
};

