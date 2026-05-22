const API_URL = 'http://localhost:3007/api';

// GET
async function getData(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

// POST
async function createData(endpoint, newData) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

// PUT
async function updateData(endpoint, id, updatedData) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

// DELETE
async function deleteData(endpoint, id) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

export {
    getData,
    createData,
    updateData,
    deleteData,
};