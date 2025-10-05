exports.handler = async (event) => {
    const { NETLIFY_FORM_ID, NETLIFY_ACCESS_TOKEN } = process.env;

    if (!NETLIFY_FORM_ID || !NETLIFY_ACCESS_TOKEN) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Переменные окружения не настроены на сервере." })
        };
    }

    const API_URL = `https://api.netlify.com/api/v1/forms/${NETLIFY_FORM_ID}/submissions`;

    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}` }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
