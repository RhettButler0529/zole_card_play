const onPlayerStatusCreate = (snapshot, context) => new Promise(((resolve, reject) => {
  const { admin } = require('../admin');
  const afterData = snapshot.val() || null;

  const { userId } = context.params;

//  console.log(userId);
//  console.log(context.eventId);

  const validEventId = context.eventId.replace('/', '')

  admin.database().ref(`playerStatusValidEventIds/${userId}`)
    .transaction(eventId => {
      if (eventId && validEventId === eventId) {
        return;
      }

      return validEventId;
    }).then(result => {
      if (!result.committed) {
        return resolve();
      }

      if (userId !== 'onlineCount' && afterData) {
      //  console.log('gained connection');

        admin.database().ref('onlineCount')
          .transaction(onlineCount => (parseInt(onlineCount, 10) || 0) + 1);

      }

      return resolve();
    }).catch(err => {
      console.log(err);
      return resolve();
    });
}));

module.exports = onPlayerStatusCreate;
