import { getRequest, postRequest, putRequest, deleteRequest } from "../api/http";

export const getCategories = () => getRequest("categories/");

export const createCategory = (data) =>
    postRequest("categories/", data, true);

export const updateCategory = (id, data) =>
    putRequest(`categories/${id}/`, data, true);

export const deleteCategory = (id) =>
    deleteRequest(`categories/${id}/`);
