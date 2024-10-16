import axios from "axios";

export const GetAPIRes = async () => {
    try {
        const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
        return data; // Only returning data here, no need to return the entire response object
    } catch (error) {
        console.error("Error fetching the API:", error);
        throw error; // Rethrow the error so it can be caught by the caller
    }
};
