/**
 * Metrics Collector for Discord Bot Performance Monitoring
 */
interface MetricValue {
    value: number;
    timestamp: number;
    labels?: Record<string, string>;
}
interface HistogramBucket {
    upperBound: number;
    count: number;
}
interface Histogram {
    buckets: HistogramBucket[];
    sum: number;
    count: number;
}
interface CounterMetric {
    type: "counter";
    value: number;
    labels?: Record<string, string>;
}
interface GaugeMetric {
    type: "gauge";
    value: number;
    labels?: Record<string, string>;
}
interface HistogramMetric {
    type: "histogram";
    histogram: Histogram;
    labels?: Record<string, string>;
}
type Metric = CounterMetric | GaugeMetric | HistogramMetric;
interface MetricsSnapshot {
    timestamp: number;
    metrics: Record<string, Metric>;
}
export declare class MetricsCollector {
    private readonly metrics;
    private readonly timeSeries;
    private readonly maxTimeSeriesLength;
    private readonly defaultHistogramBuckets;
    /**
     * Increment a counter metric
     */
    incrementCounter(name: string, value?: number, labels?: Record<string, string>): void;
    /**
     * Set a gauge metric value
     */
    setGauge(name: string, value: number, labels?: Record<string, string>): void;
    /**
     * Increment a gauge metric
     */
    incrementGauge(name: string, value?: number, labels?: Record<string, string>): void;
    /**
     * Decrement a gauge metric
     */
    decrementGauge(name: string, value?: number, labels?: Record<string, string>): void;
    /**
     * Record a histogram observation
     */
    observeHistogram(name: string, value: number, labels?: Record<string, string>, buckets?: number[]): void;
    /**
     * Time a function execution and record as histogram
     */
    timeFunction<T>(name: string, fn: () => Promise<T> | T, labels?: Record<string, string>): Promise<T>;
    /**
     * Create a timer that can be stopped manually
     */
    startTimer(name: string, labels?: Record<string, string>): () => void;
    /**
     * Get a specific metric
     */
    getMetric(name: string, labels?: Record<string, string>): Metric | undefined;
    /**
     * Get all metrics
     */
    getAllMetrics(): Record<string, Metric>;
    /**
     * Get metrics by prefix
     */
    getMetricsByPrefix(prefix: string): Record<string, Metric>;
    /**
     * Get time series data for a metric
     */
    getTimeSeries(name: string, labels?: Record<string, string>): MetricValue[];
    /**
     * Get a snapshot of all metrics at current time
     */
    getSnapshot(): MetricsSnapshot;
    /**
     * Reset a specific metric
     */
    resetMetric(name: string, labels?: Record<string, string>): void;
    /**
     * Reset all metrics
     */
    resetAllMetrics(): void;
    /**
     * Export metrics in Prometheus format
     */
    exportPrometheus(): string;
    /**
     * Register common Discord bot metrics
     */
    registerBotMetrics(): void;
    /**
     * Update system metrics
     */
    updateSystemMetrics(): void;
    /**
     * Create a unique key for metric with labels
     */
    private createKey;
    /**
     * Record time series data
     */
    private recordTimeSeries;
    /**
     * Format labels for Prometheus export
     */
    private formatPrometheusLabels;
    /**
     * Get help text for metric
     */
    private getMetricHelp;
}
export {};
//# sourceMappingURL=MetricsCollector.d.ts.map