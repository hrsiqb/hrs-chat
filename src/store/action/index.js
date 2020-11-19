const set_data = (data) => {
    return (dispatch) => {
        dispatch({type: "SETDATA", data: data })
    }
}
const get_data = (type, resolve, reject, id = '') => {
    return (dispatch) => {
        dispatch({
            type,
            resolve,
            reject,
            id,
        })
    }
}
export {
    set_data,
    get_data
}