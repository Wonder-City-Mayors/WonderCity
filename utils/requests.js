import { getCookie } from "./cookies"

const createUrl = (path, query) => {
    let keys,
        queryString = ""

    if (query) {
        keys = Object.keys(query)

        if (keys.length > 0) {
            queryString = `?${keys[0]}=${query[keys[0]]}`
        }
    } else {
        keys = new Array()
    }

    for (let i = 1; i < keys.length; i += 1) {
        queryString += `&${keys[i]}=${query[keys[i]]}`
    }

    return encodeURI(path + queryString)
}

export const getApiResponse = async (path, query, auth) => {
    if (auth === true) auth = getCookie("jwt")

    const url = createUrl(path, query, auth)
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: auth || "",
        },
    })

    if (response.ok) {
        return await response.json().catch(() => null)
    } else {
        throw response
    }
}

export const getPreloadApiResponse = async (path, query, sapperInstance) => {
    const url = createUrl(path, query)
    const response = await (
        await sapperInstance.fetch(url, {
            credentials: "include",
        })
    )
        .json()
        .then(
            (a) => a,
            () => null,
        )

    return response && "response" in response ? response.response : response
}

export const postApi = (path, query, auth) => {
    if (auth === true) auth = getCookie("jwt")

    return fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: auth || "",
        },
        body: JSON.stringify(query),
    })
        .then((response) => {
            if (response.ok)
                return response.json().then(
                    (a) => a,
                    () => null,
                )
            else throw response
        })
        .then((jsoned) =>
            jsoned && "response" in jsoned ? jsoned.response : jsoned,
        )
}
