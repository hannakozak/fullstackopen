import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const request = await axios.get(baseUrl)
    return request.data
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = async (id, updatedObject) => {
    const config = {
        headers: { Authorization: token },
    }
    const request = await axios.put(`${baseUrl}/${id}`, updatedObject, config)
    return request.data
}

const remove = async id => {
    const config = {
        headers: { Authorization: token },
    }
    const request =  await axios.delete(`${baseUrl}/${id}`, config)
    return request.data
}

export default { getAll, setToken, create, update, remove }