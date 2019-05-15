
const PATH_COLORS = ["#6BFF2A", "#C2FF2A", "#FFF22A", "#FFB22A", "#FF372A"];

function getPathColor (value, limits) {
  for (let idx in limits) {
    if (value <= limits[idx]) {
      return PATH_COLORS[idx];
    }
  };
  return PATH_COLORS[PATH_COLORS.length-1]
};

export default {
  PATH_COLORS,
  getPathColor,
}
