import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Progress from 'reactstrap/lib/Progress';
import Media from 'reactstrap/lib/Media';

import stepupImg from '../../../images/stepup.png';

class LevelProgress extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      level: PropTypes.number,
      levelupGameLimit: PropTypes.number,
      gamesPlayed: PropTypes.number,
      totalPoints: PropTypes.number,
      uid: PropTypes.string,
      status: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      pointsProgressBar: 0,
      gamesProgressBar: 0,
      pointsProgress: 0,
      gamesProgress: 0
    };
  }

  componentDidMount() {
    const { member } = this.props;
    const {
      level,
      levelupGameLimit,
      gamesPlayed,
      totalPoints,
    } = member;

    let lastGameLimit;

    if (level === 1) {
      lastGameLimit = 0;
    } else if (level === 2) {
      lastGameLimit = 5;
    } else if (level === 3) {
      lastGameLimit = 10;
    } else if (level === 4) {
      lastGameLimit = 20;
    } else {
      lastGameLimit = levelupGameLimit / 1.2;
    }

    let pointsProgress;
    let gamesProgress;
    let pointsToNextLvl;
    let gamesToNextLvl;
    if (level === 1) {
      gamesProgress = (gamesPlayed) / (5) * 100;
      gamesToNextLvl = 5 - gamesPlayed;
    } else {
      gamesProgress = (gamesPlayed - lastGameLimit) / (levelupGameLimit - lastGameLimit) * 100;
      gamesToNextLvl = levelupGameLimit - gamesPlayed;
    }
    if (level > 2) {
      pointsProgress = (totalPoints) / (((level - 3) * 5) + 10) * 100;
      pointsToNextLvl = (((level - 3) * 5) + 10) - totalPoints;
    } else {
      pointsProgress = 100;
      pointsToNextLvl = 0;
    }

    this.UpdateProgress(pointsProgress, gamesProgress, pointsToNextLvl, gamesToNextLvl);
  }

  componentDidUpdate(_prevProps, prevState) {
    const pointsProgressOld = prevState.pointsProgress;
    const gamesProgressOld = prevState.gamesProgress;

    const { member } = this.props;
    const {
      level,
      levelupGameLimit,
      gamesPlayed,
      totalPoints,
    } = member;

    if (member && member.status !== 'signedOut' && member.uid) {
      let lastGameLimit;

      if (level === 1) {
        lastGameLimit = 0;
      } else if (level === 2) {
        lastGameLimit = 5;
      } else if (level === 3) {
        lastGameLimit = 10;
      } else if (level === 4) {
        lastGameLimit = 20;
      } else {
        lastGameLimit = levelupGameLimit / 1.2;
      }

      let pointsProgress;
      let gamesProgress;
      let pointsToNextLvl;
      let gamesToNextLvl;
      if (level === 1) {
        gamesProgress = (gamesPlayed) / (5) * 100;
        gamesToNextLvl = 5 - gamesPlayed;
      } else {
        gamesProgress = (gamesPlayed - lastGameLimit) / (levelupGameLimit - lastGameLimit) * 100;
        gamesToNextLvl = levelupGameLimit - gamesPlayed;
      }
      if (level > 2) {
        pointsProgress = (totalPoints) / (((level - 3) * 5) + 10) * 100;
        pointsToNextLvl = (((level - 3) * 5) + 10) - totalPoints;
      } else {
        pointsProgress = 100;
        pointsToNextLvl = 0;
      }

      if ((pointsProgress && pointsProgressOld !== pointsProgress) || (gamesProgress && gamesProgressOld !== gamesProgress)) {
        this.UpdateProgress(pointsProgress, gamesProgress, pointsToNextLvl, gamesToNextLvl);
      }
    }
  }

  UpdateProgress = (pointsProgress, gamesProgress, pointsToNextLvl, gamesToNextLvl) => {
    let pointsProgressBar;
    if (pointsProgress < 0) {
      pointsProgressBar = 10;
    } else if (pointsProgress > 100) {
      pointsProgressBar = 100;
    } else {
      pointsProgressBar = pointsProgress;
    }

    let gamesProgressBar;
    if (gamesProgress < 0) {
      gamesProgressBar = 10;
    } else if (gamesProgress > 100) {
      gamesProgressBar = 100;
    } else {
      gamesProgressBar = gamesProgress;
    }

    this.setState({
      pointsProgressBar, gamesProgressBar, pointsToNextLvl, gamesToNextLvl, pointsProgress, gamesProgress
    });
  }

  render() {
    const { t } = this.props;

    const {
      pointsProgressBar, gamesProgressBar, pointsToNextLvl, gamesToNextLvl,
    } = this.state;

    return (
      <div>
        <Row className="levelProgress-text-row">
          <Col sm="12">
              <Fragment>
                <div className="levelProgress-text">
                  {`${t('levelProgress.untilNext')} `}
                </div>
                <Fragment>
                  <div className="levelProgress-text-yellow">
                  &nbsp;
                    {` ${gamesToNextLvl > 0 ? gamesToNextLvl : 0} `}
                  &nbsp;
                  </div>
                  <div className="levelProgress-text">
                    {`${t('levelProgress.games')}`}
                  </div>
                </Fragment>
              </Fragment>
          </Col>
        </Row>

        <div
          className="levelProgress"
        >
          <Progress
            color="success"
            value={gamesProgressBar}
            className="levelProgress-bar"
          >
            <span className="left-to-100" style={{ left: `${gamesProgressBar + (100-gamesProgressBar)/2}%` }}>{gamesToNextLvl}</span>

          </Progress>

          <Media className="stepup-img" src={stepupImg} style={{ left: `${gamesProgressBar}%`}} />

        </div>

        <Row className="levelProgress-text-row">
          <Col sm="12">
              <Fragment>
                <div className="levelProgress-text">
                  {`${t('levelProgress.untilNext')} `}
                </div>
                <Fragment>
                  <div className="levelProgress-text-yellow">
                  &nbsp;
                    {` ${pointsToNextLvl > 0 ? pointsToNextLvl : 0} `}
                  &nbsp;
                  </div>
                  <div className="levelProgress-text">
                    {`${t('levelProgress.points')}`}
                  </div>
                </Fragment>
              </Fragment>
          </Col>
        </Row>


        <div
          className="levelProgress"
        >
          <Progress
            color="success"
            value={pointsProgressBar}
            className="levelProgress-bar"
          >
            <span className="left-to-100" style={{ left: `${pointsProgressBar + (100-pointsProgressBar)/2}%` }}>{pointsToNextLvl}</span>
          </Progress>

          <Media className="stepup-img" src={stepupImg} style={{ left: `${pointsProgressBar}%`}} />

        </div>

      </div>
    );
  }
}


export default withTranslation('common')(LevelProgress);
