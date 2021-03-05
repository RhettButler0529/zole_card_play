import React from 'react';
import PropTypes from 'prop-types';

const CustomDate = React.memo(({ date, format }) => {
  let yyyy;
  let MM;
  let dd;
  let hh;
  let mm;
  if (date) {
    yyyy = new Date(date).getFullYear().toString();
    MM = (new Date(date).getMonth() + 1).toString();
    dd = new Date(date).getDate().toString();
    hh = new Date(date).getHours().toString();
    mm = new Date(date).getMinutes().toString();
  }

  if (MM < 10) { MM = 0 + MM }
  if (dd < 10) { dd = 0 + dd }
  if (hh < 10) { hh = 0 + hh }
  if (mm < 10) { mm = 0 + mm }

//  let dateString = format;

  let dateString = format.replace("YYYY", yyyy);
  dateString = dateString.replace("MM", MM);
  dateString = dateString.replace("DD", dd);
  dateString = dateString.replace("hh", hh);
  dateString = dateString.replace("mm", mm);

  return (
    <div>
      {dateString}
    </div>
  );
})

CustomDate.propTypes = {
  date: PropTypes.number,
  format: PropTypes.string,
};

CustomDate.defaultProps = {
  date: '',
  format: '',
};

export default CustomDate;
