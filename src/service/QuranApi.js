import axios from "axios";

const getsuhra = async () => {
    const response = await axios.get(
        "https://api.alquran.cloud/v1/surah"
    );

    return response.data.data;
};

export default getsuhra;