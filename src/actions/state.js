export function setLoading(_state) {
    return dispatch =>
        new Promise(resolve => {
            return resolve(dispatch({ type: 'LOADING_REPLACE', data: _state }));
        });
}