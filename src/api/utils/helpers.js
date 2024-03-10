const coordinatesPattren = new RegExp('^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}');
exports.validateCoordinates = ({ latitude, longitude }) => {
  // if (!latitude || !longitude) {
  //   throw new Error('latitude and longitude are required');
  // }
  // if (!coordinatesPattren.test(latitude) || !coordinatesPattren.test(longitude)) {
  //   throw new Error('latitude and longitude must be valid coordinates');
  // }
};
