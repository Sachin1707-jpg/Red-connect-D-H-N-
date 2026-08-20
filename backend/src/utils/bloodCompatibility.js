/**
 * Blood Compatibility Map
 * Key: recipient blood group
 * Value: array of donor blood groups that are compatible
 */
const COMPATIBILITY_MAP = {
  'A+':  ['A+', 'A-', 'O+', 'O-'],
  'A-':  ['A-', 'O-'],
  'B+':  ['B+', 'B-', 'O+', 'O-'],
  'B-':  ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+':  ['O+', 'O-'],
  'O-':  ['O-'], // Universal donor — can only receive O-
};

/**
 * Returns an array of donor blood groups compatible with the given recipient group.
 * @param {string} recipientGroup - e.g. 'O-', 'AB+'
 * @returns {string[]} compatible donor blood groups
 */
const getCompatibleDonorGroups = (recipientGroup) => {
  return COMPATIBILITY_MAP[recipientGroup] || [];
};

/**
 * Returns all blood groups that the given donor group can donate to.
 * @param {string} donorGroup
 * @returns {string[]} recipient groups
 */
const getCompatibleRecipientGroups = (donorGroup) => {
  return Object.entries(COMPATIBILITY_MAP)
    .filter(([, donors]) => donors.includes(donorGroup))
    .map(([recipient]) => recipient);
};

/**
 * Check if a specific donor can donate to a specific recipient.
 */
const canDonate = (donorGroup, recipientGroup) => {
  const compatibles = COMPATIBILITY_MAP[recipientGroup] || [];
  return compatibles.includes(donorGroup);
};

module.exports = {
  getCompatibleDonorGroups,
  getCompatibleRecipientGroups,
  canDonate,
  COMPATIBILITY_MAP,
};
