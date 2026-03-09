/**
 * ══════════════════════════════════════════════════════════════════════════════
 * MODEL METRICS — Evaluation, Cross-Validation & Training Logs
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Provides tools for evaluating ML model performance:
 *   - Accuracy, Precision, Recall, F1-Score per class
 *   - Confusion Matrix generation
 *   - K-Fold Cross-Validation
 *   - Training log aggregation
 *
 * All metrics are computed client-side with no external dependencies.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ClassificationReport {
  accuracy: number;
  macroF1: number;
  weightedF1: number;
  perClass: Record<string, {
    precision: number;
    recall: number;
    f1: number;
    support: number;
  }>;
  confusionMatrix: Record<string, Record<string, number>>;
  totalSamples: number;
}

export interface CrossValidationResult {
  folds: number;
  accuracies: number[];
  meanAccuracy: number;
  stdAccuracy: number;
  f1Scores: number[];
  meanF1: number;
}

export interface TrainingLog {
  timestamp: string;
  modelName: string;
  event: "TRAIN_START" | "TRAIN_END" | "EVAL" | "CV_FOLD" | "CV_COMPLETE";
  data: Record<string, unknown>;
}

// ─── Training Logs ───────────────────────────────────────────────────────────

const logs: TrainingLog[] = [];

export function logEvent(modelName: string, event: TrainingLog["event"], data: Record<string, unknown>): void {
  const entry: TrainingLog = {
    timestamp: new Date().toISOString(),
    modelName,
    event,
    data,
  };
  logs.push(entry);
}

export function getTrainingLogs(): TrainingLog[] {
  return [...logs];
}

export function clearTrainingLogs(): void {
  logs.length = 0;
}

// ─── Classification Report ───────────────────────────────────────────────────

/**
 * Generate a full classification report from actual vs predicted labels.
 */
export function generateClassificationReport(
  actual: string[],
  predicted: string[],
): ClassificationReport {
  const classes = [...new Set([...actual, ...predicted])].sort();
  const totalSamples = actual.length;

  // Build confusion matrix
  const cm: Record<string, Record<string, number>> = {};
  for (const c of classes) {
    cm[c] = {};
    for (const c2 of classes) cm[c][c2] = 0;
  }
  for (let i = 0; i < actual.length; i++) {
    if (cm[actual[i]]) {
      cm[actual[i]][predicted[i]] = (cm[actual[i]][predicted[i]] || 0) + 1;
    }
  }

  // Per-class metrics
  const perClass: ClassificationReport["perClass"] = {};
  let correctTotal = 0;
  let macroF1Sum = 0;
  let weightedF1Sum = 0;

  for (const c of classes) {
    let tp = 0, fp = 0, fn = 0;
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] === c && predicted[i] === c) tp++;
      else if (actual[i] !== c && predicted[i] === c) fp++;
      else if (actual[i] === c && predicted[i] !== c) fn++;
    }
    const support = tp + fn;
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

    perClass[c] = { precision, recall, f1, support };
    correctTotal += tp;
    macroF1Sum += f1;
    weightedF1Sum += f1 * support;
  }

  const accuracy = totalSamples > 0 ? correctTotal / totalSamples : 0;
  const macroF1 = classes.length > 0 ? macroF1Sum / classes.length : 0;
  const weightedF1 = totalSamples > 0 ? weightedF1Sum / totalSamples : 0;

  return { accuracy, macroF1, weightedF1, perClass, confusionMatrix: cm, totalSamples };
}

// ─── K-Fold Cross-Validation ─────────────────────────────────────────────────

/**
 * Perform K-fold cross-validation.
 *
 * @param samples   — all labelled samples
 * @param k         — number of folds (default 5)
 * @param trainFn   — function that trains a model and returns predictions for test set
 *                    trainFn(trainSet) returns a predictor (features => label)
 */
export function crossValidate(
  samples: { features: number[]; label: string }[],
  k: number,
  trainFn: (trainSet: { features: number[]; label: string }[]) => (features: number[]) => string,
): CrossValidationResult {
  // Shuffle samples
  const shuffled = [...samples].sort(() => Math.random() - 0.5);
  const foldSize = Math.ceil(shuffled.length / k);
  const accuracies: number[] = [];
  const f1Scores: number[] = [];

  for (let fold = 0; fold < k; fold++) {
    const testStart = fold * foldSize;
    const testEnd = Math.min(testStart + foldSize, shuffled.length);
    const testSet = shuffled.slice(testStart, testEnd);
    const trainSet = [...shuffled.slice(0, testStart), ...shuffled.slice(testEnd)];

    const predictor = trainFn(trainSet);

    const actual = testSet.map(s => s.label);
    const predicted = testSet.map(s => predictor(s.features));

    const report = generateClassificationReport(actual, predicted);
    accuracies.push(report.accuracy);
    f1Scores.push(report.macroF1);

    logEvent("CrossValidation", "CV_FOLD", {
      fold: fold + 1,
      accuracy: report.accuracy,
      f1: report.macroF1,
      testSize: testSet.length,
      trainSize: trainSet.length,
    });
  }

  const meanAccuracy = accuracies.reduce((a, b) => a + b, 0) / k;
  const stdAccuracy = Math.sqrt(
    accuracies.reduce((s, a) => s + Math.pow(a - meanAccuracy, 2), 0) / k
  );
  const meanF1 = f1Scores.reduce((a, b) => a + b, 0) / k;

  logEvent("CrossValidation", "CV_COMPLETE", {
    folds: k,
    meanAccuracy,
    stdAccuracy,
    meanF1,
  });

  return { folds: k, accuracies, meanAccuracy, stdAccuracy, f1Scores, meanF1 };
}

// ─── Pretty Print Report ─────────────────────────────────────────────────────

export function printClassificationReport(report: ClassificationReport): void {
  console.log(`%c╔══════════════════════════════════════════════════════╗`, "color: #e91e63; font-weight: bold");
  console.log(`%c║          CLASSIFICATION REPORT                      ║`, "color: #e91e63; font-weight: bold");
  console.log(`%c╠══════════════════════════════════════════════════════╣`, "color: #e91e63; font-weight: bold");
  console.log(`%c║  Overall Accuracy  : ${(report.accuracy * 100).toFixed(1).padStart(6)}%                      ║`, "color: #e91e63");
  console.log(`%c║  Macro F1-Score    : ${(report.macroF1 * 100).toFixed(1).padStart(6)}%                      ║`, "color: #e91e63");
  console.log(`%c║  Weighted F1-Score : ${(report.weightedF1 * 100).toFixed(1).padStart(6)}%                      ║`, "color: #e91e63");
  console.log(`%c║  Total Samples     : ${String(report.totalSamples).padStart(6)}                       ║`, "color: #e91e63");
  console.log(`%c╠══════════════════════════════════════════════════════╣`, "color: #e91e63; font-weight: bold");

  console.log(`%c║  ${"Class".padEnd(15)} ${"Prec".padStart(6)} ${"Rec".padStart(6)} ${"F1".padStart(6)} ${"Sup".padStart(5)}  ║`, "color: #e91e63");
  console.log(`%c║  ${"─".repeat(40)}  ║`, "color: #e91e63");

  for (const [cls, m] of Object.entries(report.perClass)) {
    console.log(
      `%c║  ${cls.padEnd(15)} ${(m.precision * 100).toFixed(1).padStart(6)}% ${(m.recall * 100).toFixed(1).padStart(5)}% ${(m.f1 * 100).toFixed(1).padStart(5)}% ${String(m.support).padStart(5)}  ║`,
      "color: #e91e63"
    );
  }

  console.log(`%c╚══════════════════════════════════════════════════════╝`, "color: #e91e63; font-weight: bold");
}

export function printCrossValidationResult(result: CrossValidationResult): void {
  console.log(`%c╔══════════════════════════════════════════════════════╗`, "color: #9c27b0; font-weight: bold");
  console.log(`%c║        ${result.folds}-FOLD CROSS-VALIDATION RESULTS             ║`, "color: #9c27b0; font-weight: bold");
  console.log(`%c╠══════════════════════════════════════════════════════╣`, "color: #9c27b0; font-weight: bold");

  for (let i = 0; i < result.accuracies.length; i++) {
    console.log(
      `%c║  Fold ${i + 1}: Accuracy=${(result.accuracies[i] * 100).toFixed(1)}%  F1=${(result.f1Scores[i] * 100).toFixed(1)}%             ║`,
      "color: #9c27b0"
    );
  }

  console.log(`%c╠══════════════════════════════════════════════════════╣`, "color: #9c27b0; font-weight: bold");
  console.log(`%c║  Mean Accuracy : ${(result.meanAccuracy * 100).toFixed(1)}% ± ${(result.stdAccuracy * 100).toFixed(1)}%                 ║`, "color: #9c27b0");
  console.log(`%c║  Mean F1-Score : ${(result.meanF1 * 100).toFixed(1)}%                            ║`, "color: #9c27b0");
  console.log(`%c╚══════════════════════════════════════════════════════╝`, "color: #9c27b0; font-weight: bold");
}
