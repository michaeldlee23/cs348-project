const payloadToUpdate = (payload) => {
    let res = '';
    for (const key in payload) {
        if (key == 'id') {
            continue; // Should never update id
        }
        if (typeof(payload[key]) == 'string') {
            res += `,${key}='${payload[key]}'`;
        } else {
            res += `,${key}=${payload[key]}`;
        }
    }
    return res.substr(1);
};

module.exports = {
    payloadToUpdate,
};
