import axios from "axios";

const DuasApi = async () => {
    const response = await axios.get(
        "https://ummahapi.com/api/duas"
    );

    return response.data.data.duas;
};

export default DuasApi;