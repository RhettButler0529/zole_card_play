import { Firebase, FirebaseRef, RoomsRef } from '../lib/firebase';

export function getPoints(roomId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise((resolve) => {
    RoomsRef.child(`rooms/${roomId}/points/total`)
      .on('value', (snapshot) => {
        const data = snapshot.val() || {};

        dispatch({ type: 'POINTS_TOTAL', data, roomId });
      });

    RoomsRef.child(`rooms/${roomId}/points/rounds`)
      .once('value', (snapshot) => {
        const data = snapshot.val() || {};

        dispatch({ type: 'POINTS_REPLACE', data, roomId });

        RoomsRef.child(`rooms/${roomId}/points/rounds`)
        .on('child_added', (snapshot2) => {
          const data = snapshot2.val() || null;
          const { key } = snapshot2;

          dispatch({
            type: 'POINTS_CHANGE', data, key, roomId,
          });
        });

      RoomsRef.child(`rooms/${roomId}/points/rounds`)
        .on('child_changed', (snapshot2) => {
          const data = snapshot2.val() || null;
          const { key } = snapshot2;

          dispatch({
            type: 'POINTS_CHANGE', data, key, roomId,
          });
        });
      });


    /*  FirebaseRef.child(`rooms/${roomId}/points/rounds`)
      .on('child_added', (snapshot2) => {
        const data = snapshot2.val() || null;
        const { key } = snapshot2;

        dispatch({
          type: 'POINTS_CHANGE', data, key, roomId,
        });
      });

    FirebaseRef.child(`rooms/${roomId}/points/rounds`)
      .on('child_changed', (snapshot2) => {
        const data = snapshot2.val() || null;
        const { key } = snapshot2;

        dispatch({
          type: 'POINTS_CHANGE', data, key, roomId,
        });
      }); */

    //  FirebaseRef.child(`rooms/${roomId}/points/rounds`)
    //    .on('child_removed', (snapshot2) => {
    //      const { key } = snapshot2;

    //      dispatch({ type: 'POINTS_REMOVED', data: { key, roomId } });
    //    });

    return resolve();
    //  return resolve(dispatch({ type: 'POINTS_REPLACE', data, roomId }));
  }).catch((err) => { throw err.message; });
}
