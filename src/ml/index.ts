/**
 * ══════════════════════════════════════════════════════════════════════════════
 * FASHN-MATCH ML MODULE
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * Client-side Machine Learning pipeline for outfit analysis.
 * All models run in the browser — no API calls for analysis.
 * API is used ONLY for image generation.
 * 
 * Models (Trained on 500+ samples):
 *   1. Color Detection (K-Means Clustering) — src/ml/colorDetectionModel.ts
 *   2. Occasion Classifier (Trained CART Decision Tree + KNN Ensemble)
 *      — src/ml/occasionClassifier.ts → src/ml/training/
 *   3. Outfit Recommender (Rule-based Engine) — src/ml/outfitRecommender.ts
 *   4. Random Forest Compatibility (Ensemble) — src/ml/randomForestModel.ts
 *   5. User Preference Learning (Weighted Vectors) — src/ml/preferenceLearningModel.ts
 *   6. Lip Shade Analyzer (Skin Tone Detection) — src/ml/lipShadeAnalyzer.ts
 * 
 * Training Pipeline (src/ml/training/):
 *   - featureExtractor.ts  — 7-dim feature vectors with MinMax scaling
 *   - decisionTreeTrainer.ts — CART algorithm with Gini impurity
 *   - knnClassifier.ts — Weighted Euclidean distance KNN
 *   - metrics.ts — Precision, Recall, F1, Confusion Matrix, Cross-Validation
 *   - occasionTrainingData.ts — 500+ labelled training samples (18 classes)
 *   - index.ts — Training orchestrator with caching
 * 
 * Datasets:
 *   - 50+ named colors with harmony rules — src/ml/dataset.ts
 *   - 1000+ clothing items with formality/traits — src/ml/dataset.ts
 *   - 500+ occasion training samples — src/ml/training/occasionTrainingData.ts
 *   - 8 suggestion rule sets — src/ml/dataset.ts
 */

export { extractDominantColors, type DetectedColor } from "./colorDetectionModel";
export { classifyOccasion, type OccasionPrediction } from "./occasionClassifier";
export { generateRecommendations, type OutfitSuggestion, type OutfitRecommendation } from "./outfitRecommender";
export { evaluateOutfitCompatibility, type OutfitItem, type CompatibilityResult } from "./randomForestModel";
export { recordInteraction, getPredictions, resetPreferences, scoreItemForUser, type PreferencePrediction } from "./preferenceLearningModel";
export { analyzeSkinTone, recommendLipShades, type LipAnalysisResult, type SkinToneResult } from "./lipShadeAnalyzer";
export { runFashionMLAnalysis, type FashionMLAnalysis } from "./fashionAnalyzer";

// Training pipeline exports
export { runTrainingPipeline, getTrainedModels, isModelReady, getTrainingLogs } from "./training";

// Re-export dataset for transparency
export { COLOR_DATASET, CLOTHING_DATASET, OCCASION_TRAINING_DATA, SUGGESTION_RULES, COLOR_HARMONY_RULES } from "./dataset";
