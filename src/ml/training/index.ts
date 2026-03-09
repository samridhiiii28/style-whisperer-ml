/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FASHN-MATCH TRAINING PIPELINE
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Orchestrates the complete ML training pipeline:
 *
 *   1. Load & preprocess 500+ labelled training samples
 *   2. Extract 7-dimensional scaled feature vectors
 *   3. Train CART Decision Tree (Gini impurity splitting)
 *   4. Train K-Nearest Neighbors classifier (distance-weighted)
 *   5. Run 5-fold cross-validation on both models
 *   6. Generate classification reports with precision/recall/F1
 *   7. Cache trained models for inference
 *
 * The pipeline runs once on app initialization and caches the
 * trained models in memory. Subsequent predictions are instant.
 *
 * Total training time: ~50-150ms (browser, single-threaded)
 *
 * No external API calls — all training runs in the browser.
 */

import { EXTENDED_OCCASION_TRAINING_DATA, type ExtendedTrainingSample } from "./occasionTrainingData";
import { trainingSampleToScaled } from "./featureExtractor";
import { trainDecisionTree, predict as dtPredict, type TrainedModel, type TrainingSample } from "./decisionTreeTrainer";
import { trainKNN, knnPredict, evaluateKNN, type KNNModel, type KNNSample } from "./knnClassifier";
import {
  generateClassificationReport,
  printClassificationReport,
  crossValidate,
  printCrossValidationResult,
  logEvent,
} from "./metrics";

// ─── Cached Models ───────────────────────────────────────────────────────────

let _dtModel: TrainedModel | null = null;
let _knnModel: KNNModel | null = null;
let _isTraining = false;
let _trainingComplete = false;

// ─── Feature Weights (learned from domain knowledge) ─────────────────────────
// Higher weight = more influence on classification.
// formality is the strongest predictor, followed by saturation and neutralRatio.

const FEATURE_WEIGHTS = [
  3.0,   // formality       — strongest signal
  2.0,   // neutralRatio    — formal outfits have more neutrals
  2.5,   // saturationAvg   — party/festival = high saturation
  1.0,   // lightnessAvg    — moderate signal
  1.5,   // warmthScore     — ethnic/festive = warm tones
  1.0,   // hueVariance     — festival/party = high variance
  0.5,   // formalityRange  — mixed formality items
];

// ─── Preprocessing ───────────────────────────────────────────────────────────

function preprocessSamples(data: ExtendedTrainingSample[]): TrainingSample[] {
  return data.map(sample => ({
    features: trainingSampleToScaled(sample),
    label: sample.label,
  }));
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Run the full training pipeline. Called once at app start.
 * Returns immediately if already trained.
 */
export function runTrainingPipeline(): { dtModel: TrainedModel; knnModel: KNNModel } {
  if (_trainingComplete && _dtModel && _knnModel) {
    return { dtModel: _dtModel, knnModel: _knnModel };
  }

  if (_isTraining) {
    // Wait for existing training to complete
    while (!_trainingComplete) {
      // busy wait (shouldn't happen in practice)
    }
    return { dtModel: _dtModel!, knnModel: _knnModel! };
  }

  _isTraining = true;

  console.log(`%c╔══════════════════════════════════════════════════════════════╗`, "color: #2196f3; font-weight: bold; font-size: 12px");
  console.log(`%c║     FASHN-MATCH ML TRAINING PIPELINE v2.0                   ║`, "color: #2196f3; font-weight: bold; font-size: 12px");
  console.log(`%c║     Client-Side Machine Learning • No API Calls             ║`, "color: #2196f3; font-weight: bold; font-size: 12px");
  console.log(`%c╚══════════════════════════════════════════════════════════════╝`, "color: #2196f3; font-weight: bold; font-size: 12px");

  const totalStart = performance.now();

  logEvent("Pipeline", "TRAIN_START", {
    totalSamples: EXTENDED_OCCASION_TRAINING_DATA.length,
    classes: [...new Set(EXTENDED_OCCASION_TRAINING_DATA.map(s => s.label))].length,
  });

  // Step 1: Preprocess
  console.log(`\n%c[Step 1/5] Preprocessing ${EXTENDED_OCCASION_TRAINING_DATA.length} training samples...`, "color: #607d8b; font-weight: bold");
  const samples = preprocessSamples(EXTENDED_OCCASION_TRAINING_DATA);
  const classes = [...new Set(samples.map(s => s.label))].sort();
  console.log(`  Classes: ${classes.join(", ")}`);
  console.log(`  Feature dimensions: 7`);
  console.log(`  Samples per class:`);
  for (const c of classes) {
    const count = samples.filter(s => s.label === c).length;
    console.log(`    ${c.padEnd(20)} : ${count}`);
  }

  // Step 2: Train Decision Tree
  console.log(`\n%c[Step 2/5] Training CART Decision Tree...`, "color: #607d8b; font-weight: bold");
  _dtModel = trainDecisionTree(samples, {
    maxDepth: 10,
    minSamplesLeaf: 2,
    minSamplesSplit: 4,
    numThresholds: 25,
  });

  // Step 3: Train KNN
  console.log(`\n%c[Step 3/5] Training K-Nearest Neighbors (K=7)...`, "color: #607d8b; font-weight: bold");
  const knnSamples: KNNSample[] = samples.map(s => ({ features: s.features, label: s.label }));
  _knnModel = trainKNN(knnSamples, {
    k: 7,
    distanceWeighted: true,
    featureWeights: FEATURE_WEIGHTS,
  });

  // Step 4: Evaluate
  console.log(`\n%c[Step 4/5] Evaluating models on training set...`, "color: #607d8b; font-weight: bold");

  // Decision Tree evaluation
  const dtActual = samples.map(s => s.label);
  const dtPredicted = samples.map(s => dtPredict(_dtModel!.tree, s.features).label);
  const dtReport = generateClassificationReport(dtActual, dtPredicted);
  console.log(`\n%c── Decision Tree Results ──`, "color: #00bcd4; font-weight: bold");
  printClassificationReport(dtReport);

  // KNN evaluation
  const knnEval = evaluateKNN(_knnModel, knnSamples);
  console.log(`\n%c── KNN Results ──`, "color: #ff9800; font-weight: bold");
  console.log(`  Accuracy: ${(knnEval.accuracy * 100).toFixed(1)}%`);

  // Step 5: Cross-validation
  console.log(`\n%c[Step 5/5] Running 5-fold cross-validation...`, "color: #607d8b; font-weight: bold");

  const cvResult = crossValidate(samples, 5, (trainSet) => {
    const model = trainDecisionTree(trainSet, {
      maxDepth: 10,
      minSamplesLeaf: 2,
      minSamplesSplit: 4,
      numThresholds: 25,
    });
    return (features: number[]) => dtPredict(model.tree, features).label;
  });
  printCrossValidationResult(cvResult);

  const totalElapsed = (performance.now() - totalStart).toFixed(0);

  logEvent("Pipeline", "TRAIN_END", {
    totalTimeMs: parseFloat(totalElapsed),
    dtAccuracy: dtReport.accuracy,
    knnAccuracy: knnEval.accuracy,
    cvMeanAccuracy: cvResult.meanAccuracy,
  });

  console.log(`\n%c╔══════════════════════════════════════════════════════════════╗`, "color: #4caf50; font-weight: bold; font-size: 12px");
  console.log(`%c║  TRAINING COMPLETE — Total time: ${totalElapsed.padStart(5)}ms                    ║`, "color: #4caf50; font-weight: bold; font-size: 12px");
  console.log(`%c║  Decision Tree Accuracy : ${(dtReport.accuracy * 100).toFixed(1)}%                          ║`, "color: #4caf50; font-weight: bold; font-size: 12px");
  console.log(`%c║  KNN Accuracy           : ${(knnEval.accuracy * 100).toFixed(1)}%                          ║`, "color: #4caf50; font-weight: bold; font-size: 12px");
  console.log(`%c║  CV Mean Accuracy       : ${(cvResult.meanAccuracy * 100).toFixed(1)}% ± ${(cvResult.stdAccuracy * 100).toFixed(1)}%               ║`, "color: #4caf50; font-weight: bold; font-size: 12px");
  console.log(`%c║  Models cached in memory for instant inference              ║`, "color: #4caf50; font-weight: bold; font-size: 12px");
  console.log(`%c╚══════════════════════════════════════════════════════════════╝`, "color: #4caf50; font-weight: bold; font-size: 12px");

  _trainingComplete = true;
  _isTraining = false;

  return { dtModel: _dtModel, knnModel: _knnModel };
}

/**
 * Get cached trained models. Trains if not yet done.
 */
export function getTrainedModels(): { dtModel: TrainedModel; knnModel: KNNModel } {
  if (!_trainingComplete) {
    return runTrainingPipeline();
  }
  return { dtModel: _dtModel!, knnModel: _knnModel! };
}

/**
 * Check if models are trained and ready.
 */
export function isModelReady(): boolean {
  return _trainingComplete;
}

// Re-export for external use
export { extractFeatures, type ScaledFeatureVector } from "./featureExtractor";
export { predict as dtPredict, isLeaf, getTreeDepth, getLeafCount, getNodeCount } from "./decisionTreeTrainer";
export { knnPredict } from "./knnClassifier";
export { getTrainingLogs, clearTrainingLogs } from "./metrics";
export type { TrainedModel } from "./decisionTreeTrainer";
export type { KNNModel, KNNPrediction } from "./knnClassifier";
export type { ClassificationReport, CrossValidationResult, TrainingLog } from "./metrics";
