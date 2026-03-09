/**
 * ══════════════════════════════════════════════════════════════════════════════
 * K-NEAREST NEIGHBORS CLASSIFIER — Weighted Euclidean Distance
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * A lazy learner that stores all training samples and classifies new inputs
 * by majority vote among the K closest neighbors. Uses inverse-distance
 * weighting so that closer neighbors have more influence.
 *
 * Hyperparameters:
 *   - k                : number of neighbors (default 5)
 *   - distanceWeighted : use 1/d² weighting (default true)
 *   - featureWeights   : per-feature importance weights (optional)
 *
 * Provides both single prediction and confidence-ranked alternatives.
 *
 * No external dependencies — runs entirely in the browser.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KNNSample {
  features: number[];
  label: string;
}

export interface KNNConfig {
  k: number;
  distanceWeighted: boolean;
  featureWeights: number[];
}

export interface KNNPrediction {
  label: string;
  confidence: number;
  votes: Record<string, number>;
  neighbors: { label: string; distance: number }[];
  alternatives: string[];
}

export interface KNNModel {
  samples: KNNSample[];
  config: KNNConfig;
  classes: string[];
  featureCount: number;
  trainedAt: string;
}

// ─── Default Config ──────────────────────────────────────────────────────────

const DEFAULT_K = 5;

// ─── Distance Functions ──────────────────────────────────────────────────────

function weightedEuclidean(a: number[], b: number[], weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const w = weights[i] ?? 1;
    sum += w * Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Build a KNN model from labelled training samples.
 */
export function trainKNN(
  samples: KNNSample[],
  config: Partial<KNNConfig> = {},
): KNNModel {
  const featureCount = samples[0]?.features.length ?? 0;
  const classes = [...new Set(samples.map(s => s.label))].sort();
  const defaultWeights = new Array(featureCount).fill(1);

  const cfg: KNNConfig = {
    k: config.k ?? DEFAULT_K,
    distanceWeighted: config.distanceWeighted ?? true,
    featureWeights: config.featureWeights ?? defaultWeights,
  };

  console.log(`%c[KNNClassifier] ═══ Model Built ═══`, "color: #ff9800; font-weight: bold");
  console.log(`  Samples    : ${samples.length}`);
  console.log(`  Classes    : ${classes.length} (${classes.join(", ")})`);
  console.log(`  K          : ${cfg.k}`);
  console.log(`  Weighted   : ${cfg.distanceWeighted}`);

  return {
    samples,
    config: cfg,
    classes,
    featureCount,
    trainedAt: new Date().toISOString(),
  };
}

/**
 * Classify a new feature vector using the KNN model.
 */
export function knnPredict(model: KNNModel, features: number[]): KNNPrediction {
  const distances = model.samples.map(s => ({
    label: s.label,
    distance: weightedEuclidean(features, s.features, model.config.featureWeights),
  }));

  distances.sort((a, b) => a.distance - b.distance);
  const neighbors = distances.slice(0, model.config.k);

  // Voting (optionally distance-weighted)
  const votes: Record<string, number> = {};
  for (const n of neighbors) {
    const weight = model.config.distanceWeighted
      ? 1 / (n.distance * n.distance + 1e-6) // add epsilon to avoid /0
      : 1;
    votes[n.label] = (votes[n.label] || 0) + weight;
  }

  // Normalize votes to sum to 1
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const normalized: Record<string, number> = {};
  for (const [label, v] of Object.entries(votes)) {
    normalized[label] = v / totalVotes;
  }

  // Best label
  const sorted = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
  const label = sorted[0][0];
  const confidence = Math.round(sorted[0][1] * 100);

  const alternatives = sorted.slice(1, 3).map(([l]) => l);

  return { label, confidence, votes: normalized, neighbors, alternatives };
}

/**
 * Evaluate accuracy of KNN on a test set.
 */
export function evaluateKNN(model: KNNModel, testSamples: KNNSample[]): {
  accuracy: number;
  perClassAccuracy: Record<string, number>;
  confusionMatrix: Record<string, Record<string, number>>;
} {
  const confusion: Record<string, Record<string, number>> = {};
  const classCorrect: Record<string, number> = {};
  const classTotal: Record<string, number> = {};

  for (const c of model.classes) {
    confusion[c] = {};
    for (const c2 of model.classes) confusion[c][c2] = 0;
    classCorrect[c] = 0;
    classTotal[c] = 0;
  }

  let correct = 0;
  for (const sample of testSamples) {
    const pred = knnPredict(model, sample.features);
    if (confusion[sample.label]) {
      confusion[sample.label][pred.label] = (confusion[sample.label][pred.label] || 0) + 1;
    }
    classTotal[sample.label] = (classTotal[sample.label] || 0) + 1;
    if (pred.label === sample.label) {
      correct++;
      classCorrect[sample.label] = (classCorrect[sample.label] || 0) + 1;
    }
  }

  const perClassAccuracy: Record<string, number> = {};
  for (const c of model.classes) {
    perClassAccuracy[c] = classTotal[c] > 0 ? classCorrect[c] / classTotal[c] : 0;
  }

  return {
    accuracy: testSamples.length > 0 ? correct / testSamples.length : 0,
    perClassAccuracy,
    confusionMatrix: confusion,
  };
}
