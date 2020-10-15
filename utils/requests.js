const createUrl = (path, query, auth) => {
  let keys,
    queryString = '';

  if (query) {
    keys = Object.keys(query);

    if (keys.length > 0) {
      queryString = `?${keys[0]}=${query[keys[0]]}`;
    }
  } else {
    keys = new Array();
  }

  for (let i = 1; i < keys.length; i += 1) {
    queryString += `&${keys[i]}=${query[keys[i]]}`;
  }

  return encodeURI(path + queryString);
};

export const getApiResponse = async (path, query, auth) => {
  const url = createUrl(path, query, auth);

  return await (await fetch(url, {
    method: 'GET',
    headers: {
      'Custom-Authorization': auth || ''
    }
  })).json();
};

export const getPreloadApiResponse = async (path, query, sapperInstance) => {
  const url = createUrl(path, query);
  const response = await (
    await sapperInstance.fetch(url, {
      credentials: 'include'
    })
  ).json()

  return response.hasOwnProperty('response') ?
    response.response :
    response;
};

export const postApi = async (path, query) => {
  return await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query)
  });
};