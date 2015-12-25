'use strict';

let AbstractSensorType = require('./AbstractSensorType');

const DETAILS = {
  config: ['on', 'battery', 'url'],
  state:  ['status'],
};

/**
 * Sensor type: CLIPGenericStatus
 */
class ClipGenericStatus extends AbstractSensorType {
  /**
   * Constructor
   */
  constructor() {
    super(DETAILS);
  }
}

module.exports = ClipGenericStatus;