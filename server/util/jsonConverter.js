'use strict';

const payloadToUpdate = (payload) => {
    let res = '';
    for (const key in payload) {
        if (key == 'id') {
            continue; // Never update the primary key
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
