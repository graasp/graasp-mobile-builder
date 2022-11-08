import PropTypes from 'prop-types';

import { ITEM_TYPES } from '../../config/constants/constants';
import { UnknownExtra } from '../../types';

//export const getFileExtra = (extra: UnknownExtra) => extra?.[ITEM_TYPES.FILE];

export function getFileExtra<T extends UnknownExtra>(extra: T) {
  return extra?.[ITEM_TYPES.FILE];
}

export const getS3FileExtra = (extra: UnknownExtra) =>
  extra?.[ITEM_TYPES.S3_FILE];

export const getEmbeddedLinkExtra = (extra: UnknownExtra) =>
  extra?.[ITEM_TYPES.LINK];

export const fileExtraPropTypes = PropTypes.shape({
  mimetype: PropTypes.string.isRequired,
});

export const s3FileExtraPropTypes = PropTypes.shape({
  contenttype: PropTypes.string.isRequired,
});

export const linkExtraPropTypes = PropTypes.shape({
  icons: PropTypes.arrayOf(PropTypes.string),
});
