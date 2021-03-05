import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ScoreTableRow = React.memo(({
  player1,
  player2,
  player3,
  pule,
  player1ShortName,
  player2ShortName,
  player3ShortName,
  myPos,
  index,
}) => (
  <Fragment>
    <td className="score-table-id-col" style={{ textAlign: 'center' }}>{index + 1}</td>
    <td className="score-table-col" style={{ textAlign: 'center' }}>
      <Fragment>
        {myPos === 'player1' && (
          <Fragment>
            {player2}
          </Fragment>
        )}
        {myPos === 'player2' && (
          <Fragment>
            {player3}
          </Fragment>
        )}
        {myPos === 'player3' && (
          <Fragment>
            {player1}
          </Fragment>
        )}
      </Fragment>
    </td>
    <td className="score-table-col" style={{ textAlign: 'center' }}>
      <Fragment>
        {myPos === 'player1' && (
          <Fragment>
            {player1}
          </Fragment>
        )}
        {myPos === 'player2' && (
          <Fragment>
            {player2}
          </Fragment>
        )}
        {myPos === 'player3' && (
          <Fragment>
            {player3}
          </Fragment>
        )}
      </Fragment>
    </td>
    <td className="score-table-col" style={{ textAlign: 'center' }}>
      <Fragment>
        {myPos === 'player1' && (
          <Fragment>
            {player3}
          </Fragment>
        )}
        {myPos === 'player2' && (
          <Fragment>
            {player1}
          </Fragment>
        )}
        {myPos === 'player3' && (
          <Fragment>
            {player2}
          </Fragment>
        )}
      </Fragment>
    </td>
    <td className="score-table-pules-col" style={{ textAlign: 'center' }}>
      {pule === 'P' && (
        <div> P </div>
      )}
      {pule === 'P-' && (
        <span className="strikeout"> P </span>
      )}
      {pule === 'player1' && (
        <div>
          { player1ShortName }
        </div>
      )}
      {pule === 'player1-' && (
        <span className="strikeout">
          { player1ShortName }
        </span>
      )}
      {pule === 'player2' && (
        <div>
          { player2ShortName }
        </div>
      )}
      {pule === 'player2-' && (
        <span className="strikeout">
          { player2ShortName }
        </span>
      )}
      {pule === 'player3' && (
        <div>
          { player3ShortName }
        </div>
      )}
      {pule === 'player3-' && (
        <span className="strikeout">
          { player3ShortName }
        </span>
      )}
    </td>
  </Fragment>
));

ScoreTableRow.propTypes = {
  player1: PropTypes.number,
  player2: PropTypes.number,
  player3: PropTypes.number,
  pule: PropTypes.string,
  player1ShortName: PropTypes.string,
  player2ShortName: PropTypes.string,
  player3ShortName: PropTypes.string,
  myPos: PropTypes.string,
  index: PropTypes.number,
};

ScoreTableRow.defaultProps = {
  player1: null,
  player2: null,
  player3: null,
  pule: null,
  player1ShortName: null,
  player2ShortName: null,
  player3ShortName: null,
  myPos: null,
  index: null,
};

export default ScoreTableRow;
