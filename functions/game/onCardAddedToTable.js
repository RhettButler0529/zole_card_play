// const { admin } = require('../admin');
const determineStrongestCard = require('./determineStrongestCard');
// const log = require('../logs/log');

const onCardAddedToTable = (change, context) => new Promise(((resolve, reject) => {
  const afterData = change.after.val();
  const { roomId } = context.params;

  const date = Date.now();

  //  if (afterData && afterData.card) {
  if (afterData && Object.keys(afterData).length === 3) {
  //  console.log(roomId);
  //  admin.database().ref(`/rooms/${roomId}/curRnd/currentTable`).once('value', (snapshot2) => {
  //    const currentTable = snapshot2.val() || null;

  //  log(roomId, 'onCardAddedToTable', afterData);

    //  resolve();

    //  if (afterData) {
    determineStrongestCard(roomId, afterData, date)
      .then(res => resolve(res))
      .catch(err => reject(err));
    //  } else {
    //    console.log('no curentTable');
    //    console.log(roomId);
    //    return resolve();
    //  }
  //  });
  } else {
    return resolve('less than 3 cards on table');
  }
}));

module.exports = onCardAddedToTable;
