import COLORS from "utils/styles";

const POPULATION_COLOR = COLORS.BLUE;
const ENVIRONMENT_COLOR = COLORS.RED;
const width = 800;
const height = 500;
const graph1Data = [
  {
    min: 0,
    max: 5,
    initialValue: 1,
    maxIcon: "fast-forward",
    minIcon: "step-forward",
    title: "Growth rate for the population",
    color: POPULATION_COLOR,
    equationParameter: true
  }
];
const graph2Data = [
  ...graph1Data,
  {
    min: 0,
    max: 100,
    initialValue: 10,
    maxIcon: "users",
    minIcon: "user",
    title: "Carrying capacity for the environment",
    color: POPULATION_COLOR,
    equationParameter: true
  }
];
const graph3Data = [
  ...graph1Data,
  {
    min: 1,
    max: 100,
    initialValue: 10,
    maxIcon: "",
    minIcon: "",
    title: "Threshold beyond which the environment can't support a population",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  },
  {
    min: 0,
    max: 100,
    initialValue: 10,
    maxIcon: "",
    minIcon: "",
    title: "Carrying capacity in a natural (unpolluted) environment",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  },
  {
    min: 0,
    max: 5,
    initialValue: 1,
    maxIcon: "",
    minIcon: "",
    title: "Recovery rate for the environment",
    color: ENVIRONMENT_COLOR,
    equationParameter: true
  }
];

const K = (K_0, e_c, e) => K_0 * (1 - e / e_c);
const exponential = A => (x, y) => [A * y];
const logistic = (A, r) => (x, y) => [A * y * (1 - y / r)];
const model0 = (A, K_0, e_c, C) => (x, y) => [
  A * y[0] * (1 - y[0] / K(K_0, e_c, y[1])),
  -C * y[1]
];

const visualizationData = [
  {
    initialData: graph1Data,
    width,
    height,
    smallestY: 0,
    largestY: 100,
    diffEqs: [exponential],
    svgIds: ["vis1"],
    xLabel: "Time",
    yLabel: "Population",
    colors: [POPULATION_COLOR]
  },
  {
    initialData: graph2Data,
    width,
    height,
    smallestY: 0,
    largestY: 101,
    diffEqs: [logistic],
    svgIds: ["vis2"],
    xLabel: "Time",
    yLabel: "Population",
    colors: [POPULATION_COLOR]
  },
  {
    initialData: graph3Data,
    width,
    height,
    smallestY: 0,
    largestY: 101,
    diffEqs: [model0],
    svgIds: "model0",
    xLabel: "Time",
    yLabel: "Population & Environment State",
    colors: [POPULATION_COLOR, ENVIRONMENT_COLOR]
  }
];

export default visualizationData;
