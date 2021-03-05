import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import Button from 'reactstrap/lib/Button';

const Tooltip = ({
//  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  skipProps,
  //  locale,
  size,
  t,
}) => (
  <div className="tooltip-body" {...tooltipProps}>
    {step.title && <h2 className="tooltip-body-title">{step.title}</h2>}
    <div className="tooltip-body-content">{step.content}</div>
    <div className="tooltip-body-footer">
      <Button className="tooltip-body-skip" {...skipProps}>
        {t('tutorial.skip')}
      </Button>
      <div className="tooltip-body-right-buttons">
        {index + 1 < size && (
        <Button className="tooltip-body-button" {...primaryProps}>
          {`${t('tutorial.next')} (${index + 1} / ${size})`}
        </Button>
        )}
        {index + 1 === size && (
        <Button className="tooltip-body-button" {...closeProps}>
          {t('common.close')}
        </Button>
        )}
        {index > 0 && (
        <Button className="tooltip-body-button" {...backProps}>
          {t('tutorial.back')}
        </Button>
        )}
      </div>
    </div>
  </div>
);

Tooltip.propTypes = {
  continuous: PropTypes.bool,
  index: PropTypes.number,
  step: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  backProps: PropTypes.shape({}),
  closeProps: PropTypes.shape({}),
  primaryProps: PropTypes.shape({}),
  tooltipProps: PropTypes.shape({}),
  skipProps: PropTypes.shape({}),
  size: PropTypes.number,
  t: PropTypes.shape({}),
};

Tooltip.defaultProps = {
  continuous: false,
  index: null,
  step: {},
  backProps: {},
  closeProps: {},
  primaryProps: {},
  tooltipProps: {},
  skipProps: {},
  size: null,
  t: {},
};

export default withTranslation('common')(Tooltip);
