/**
 * ══════════════════════════════════════════════════════════════════════════════
 * DECISION TREE TRAINER — CART Algorithm with Gini Impurity
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Trains a binary decision tree classifier using the CART (Classification
 * And Regression Trees) algorithm. Splits are chosen by minimising
 * weighted Gini impurity across all feature dimensions.
 *
 * Hyperparameters:
 *   - maxDepth       : maximum tree depth (default 8)
 *   - minSamplesLeaf : minimum samples per leaf (default 3)
 *   - minSamplesSplit: minimum samples to attempt a split (default 5)
 *   - numThresholds  : candidate thresholds per feature (default 20)
 *
 * Produces a serialisable TreeNode structure that can be traversed at
 * inference time with zero overhead.
 *
 * No external dependencies — runs entirely in the browser.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TrainingSample {
  features: number[];   // scaled feature vector
  label: string;        // target class
}

export interface TreeNode {
  featureIndex: number;
  threshold: number;
  left: TreeNode | LeafNode;
  right: TreeNode | LeafNode;
  depth: number;
  samplesCount: number;
}

export interface LeafNode {
  label: string;
  confidence: number;   // fraction of majority class in this leaf
  distribution: Record<string, number>; // class → count
  depth: number;
  samplesCount: number;
}

export interface TrainingConfig {
  maxDepth: number;
  minSamplesLeaf: number;
  minSamplesSplit: number;
  numThresholds: number;
}

export interface TrainedModel {
  tree: TreeNode | LeafNode;
  config: TrainingConfig;
  classes: string[];
  featureCount: number;
  trainingSamples: number;
  trainedAt: string;
  trainingAccuracy: number;
}

// ─── Default Configuration ───────────────────────────────────────────────────

const DEFAULT_CONFIG: TrainingConfig = {
  maxDepth: 8,
  minSamplesLeaf: 3,
  minSamplesSplit: 5,
  numThresholds: 20,
};

// ─── Gini Impurity ───────────────────────────────────────────────────────────

function giniImpurity(labels: string[]): number {
  if (labels.length === 0) return 0;
  const counts: Record<string, number> = {};
  for (const l of labels) counts[l] = (counts[l] || 0) + 1;
  let impurity = 1;
  for (const c of Object.values(counts)) {
    const p = c / labels.length;
    impurity -= p * p;
  }
  return impurity;
}

function weightedGini(left: string[], right: string[]): number {
  const total = left.length + right.length;
  if (total === 0) return 0;
  return (left.length / total) * giniImpurity(left) +
         (right.length / total) * giniImpurity(right);
}

// ─── Best Split Finder ───────────────────────────────────────────────────────

interface SplitCandidate {
  featureIndex: number;
  threshold: number;
  gini: number;
  leftIndices: number[];
  rightIndices: number[];
}

function findBestSplit(
  samples: TrainingSample[],
  config: TrainingConfig,
): SplitCandidate | null {
  const numFeatures = samples[0].features.length;
  let best: SplitCandidate | null = null;

  for (let f = 0; f < numFeatures; f++) {
    // Get unique sorted values for this feature
    const values = samples.map(s => s.features[f]).sort((a, b) => a - b);
    const uniqueValues = [...new Set(values)];

    if (uniqueValues.length <= 1) continue;

    // Generate candidate thresholds (midpoints between consecutive unique values)
    const candidates: number[] = [];
    const step = Math.max(1, Math.floor(uniqueValues.length / config.numThresholds));
    for (let i = 0; i < uniqueValues.length - 1; i += step) {
      candidates.push((uniqueValues[i] + uniqueValues[i + 1]) / 2);
    }

    for (const threshold of candidates) {
      const leftIdx: number[] = [];
      const rightIdx: number[] = [];

      for (let i = 0; i < samples.length; i++) {
        if (samples[i].features[f] <= threshold) {
          leftIdx.push(i);
        } else {
          rightIdx.push(i);
        }
      }

      // Check minimum leaf size
      if (leftIdx.length < config.minSamplesLeaf ||
          rightIdx.length < config.minSamplesLeaf) continue;

      const leftLabels = leftIdx.map(i => samples[i].label);
      const rightLabels = rightIdx.map(i => samples[i].label);
      const gini = weightedGini(leftLabels, rightLabels);

      if (!best || gini < best.gini) {
        best = { featureIndex: f, threshold, gini, leftIndices: leftIdx, rightIndices: rightIdx };
      }
    }
  }

  return best;
}

// ─── Leaf Constructor ────────────────────────────────────────────────────────

function createLeaf(samples: TrainingSample[], depth: number): LeafNode {
  const distribution: Record<string, number> = {};
  for (const s of samples) distribution[s.label] = (distribution[s.label] || 0) + 1;

  let bestLabel = "";
  let bestCount = 0;
  for (const [label, count] of Object.entries(distribution)) {
    if (count > bestCount) {
      bestLabel = label;
      bestCount = count;
    }
  }

  return {
    label: bestLabel,
    confidence: samples.length > 0 ? bestCount / samples.length : 0,
    distribution,
    depth,
    samplesCount: samples.length,
  };
}

// ─── Recursive Tree Builder ──────────────────────────────────────────────────

function buildTree(
  samples: TrainingSample[],
  depth: number,
  config: TrainingConfig,
): TreeNode | LeafNode {
  // Base cases: create leaf
  if (depth >= config.maxDepth) return createLeaf(samples, depth);
  if (samples.length < config.minSamplesSplit) return createLeaf(samples, depth);

  // Check if all samples have the same label
  const uniqueLabels = new Set(samples.map(s => s.label));
  if (uniqueLabels.size === 1) return createLeaf(samples, depth);

  // Find best split
  const split = findBestSplit(samples, config);
  if (!split) return createLeaf(samples, depth);

  // Check if split improves over parent
  const parentGini = giniImpurity(samples.map(s => s.label));
  if (split.gini >= parentGini - 0.001) return createLeaf(samples, depth);

  // Recurse
  const leftSamples = split.leftIndices.map(i => samples[i]);
  const rightSamples = split.rightIndices.map(i => samples[i]);

  return {
    featureIndex: split.featureIndex,
    threshold: split.threshold,
    left: buildTree(leftSamples, depth + 1, config),
    right: buildTree(rightSamples, depth + 1, config),
    depth,
    samplesCount: samples.length,
  };
}

// ─── Prediction ──────────────────────────────────────────────────────────────

export function isLeaf(node: TreeNode | LeafNode): node is LeafNode {
  return "label" in node;
}

export function predict(node: TreeNode | LeafNode, features: number[]): LeafNode {
  if (isLeaf(node)) return node;
  if (features[node.featureIndex] <= node.threshold) {
    return predict(node.left, features);
  }
  return predict(node.right, features);
}

// ─── Tree Statistics ─────────────────────────────────────────────────────────

export function getTreeDepth(node: TreeNode | LeafNode): number {
  if (isLeaf(node)) return node.depth;
  return Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

export function getLeafCount(node: TreeNode | LeafNode): number {
  if (isLeaf(node)) return 1;
  return getLeafCount(node.left) + getLeafCount(node.right);
}

export function getNodeCount(node: TreeNode | LeafNode): number {
  if (isLeaf(node)) return 1;
  return 1 + getNodeCount(node.left) + getNodeCount(node.right);
}

// ─── Training Accuracy ───────────────────────────────────────────────────────

function evaluateAccuracy(tree: TreeNode | LeafNode, samples: TrainingSample[]): number {
  let correct = 0;
  for (const s of samples) {
    const prediction = predict(tree, s.features);
    if (prediction.label === s.label) correct++;
  }
  return samples.length > 0 ? correct / samples.length : 0;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Train a CART decision tree on labelled samples.
 *
 * @param samples   — array of {features: number[], label: string}
 * @param config    — optional hyperparameters
 * @returns TrainedModel with serialisable tree, metadata, and accuracy
 */
export function trainDecisionTree(
  samples: TrainingSample[],
  config: Partial<TrainingConfig> = {},
): TrainedModel {
  const cfg: TrainingConfig = { ...DEFAULT_CONFIG, ...config };

  if (samples.length === 0) {
    throw new Error("[DecisionTreeTrainer] Cannot train on empty dataset");
  }

  const classes = [...new Set(samples.map(s => s.label))].sort();
  const featureCount = samples[0].features.length;

  console.log(`%c[DecisionTreeTrainer] ═══ Training Started ═══`, "color: #00bcd4; font-weight: bold");
  console.log(`  Samples    : ${samples.length}`);
  console.log(`  Classes    : ${classes.length} (${classes.join(", ")})`);
  console.log(`  Features   : ${featureCount}`);
  console.log(`  MaxDepth   : ${cfg.maxDepth}`);
  console.log(`  MinLeaf    : ${cfg.minSamplesLeaf}`);
  console.log(`  MinSplit   : ${cfg.minSamplesSplit}`);

  const startTime = performance.now();
  const tree = buildTree(samples, 0, cfg);
  const elapsed = (performance.now() - startTime).toFixed(2);

  const accuracy = evaluateAccuracy(tree, samples);

  console.log(`%c[DecisionTreeTrainer] ═══ Training Complete ═══`, "color: #4caf50; font-weight: bold");
  console.log(`  Time       : ${elapsed}ms`);
  console.log(`  Tree Depth : ${getTreeDepth(tree)}`);
  console.log(`  Leaf Nodes : ${getLeafCount(tree)}`);
  console.log(`  Total Nodes: ${getNodeCount(tree)}`);
  console.log(`  Accuracy   : ${(accuracy * 100).toFixed(1)}%`);

  return {
    tree,
    config: cfg,
    classes,
    featureCount,
    trainingSamples: samples.length,
    trainedAt: new Date().toISOString(),
    trainingAccuracy: accuracy,
  };
}
