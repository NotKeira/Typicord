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

export class MetricsCollector {
  private readonly metrics = new Map<string, Metric>();
  private readonly timeSeries = new Map<string, MetricValue[]>();
  private readonly maxTimeSeriesLength = 1000;
  private readonly defaultHistogramBuckets = [
    0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10,
  ];

  /**
   * Increment a counter metric
   */
  incrementCounter(
    name: string,
    value = 1,
    labels?: Record<string, string>
  ): void {
    const key = this.createKey(name, labels);
    const existing = this.metrics.get(key) as CounterMetric;

    if (existing && existing.type === "counter") {
      existing.value += value;
    } else {
      this.metrics.set(key, {
        type: "counter",
        value,
        labels,
      });
    }

    this.recordTimeSeries(key, value, labels);
  }

  /**
   * Set a gauge metric value
   */
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.createKey(name, labels);

    this.metrics.set(key, {
      type: "gauge",
      value,
      labels,
    });

    this.recordTimeSeries(key, value, labels);
  }

  /**
   * Increment a gauge metric
   */
  incrementGauge(
    name: string,
    value = 1,
    labels?: Record<string, string>
  ): void {
    const key = this.createKey(name, labels);
    const existing = this.metrics.get(key) as GaugeMetric;

    if (existing && existing.type === "gauge") {
      existing.value += value;
    } else {
      this.metrics.set(key, {
        type: "gauge",
        value,
        labels,
      });
    }

    this.recordTimeSeries(key, value, labels);
  }

  /**
   * Decrement a gauge metric
   */
  decrementGauge(
    name: string,
    value = 1,
    labels?: Record<string, string>
  ): void {
    this.incrementGauge(name, -value, labels);
  }

  /**
   * Record a histogram observation
   */
  observeHistogram(
    name: string,
    value: number,
    labels?: Record<string, string>,
    buckets?: number[]
  ): void {
    const key = this.createKey(name, labels);
    const bucketUpperBounds = buckets || this.defaultHistogramBuckets;
    const existing = this.metrics.get(key) as HistogramMetric;

    if (existing && existing.type === "histogram") {
      existing.histogram.sum += value;
      existing.histogram.count++;

      for (const bucket of existing.histogram.buckets) {
        if (value <= bucket.upperBound) {
          bucket.count++;
        }
      }
    } else {
      const histogramBuckets: HistogramBucket[] = bucketUpperBounds.map(
        upperBound => ({
          upperBound,
          count: value <= upperBound ? 1 : 0,
        })
      );

      this.metrics.set(key, {
        type: "histogram",
        histogram: {
          buckets: histogramBuckets,
          sum: value,
          count: 1,
        },
        labels,
      });
    }

    this.recordTimeSeries(key, value, labels);
  }

  /**
   * Time a function execution and record as histogram
   */
  async timeFunction<T>(
    name: string,
    fn: () => Promise<T> | T,
    labels?: Record<string, string>
  ): Promise<T> {
    const start = process.hrtime.bigint();

    try {
      const result = await fn();
      const duration = Number(process.hrtime.bigint() - start) / 1000000; // Convert to milliseconds
      this.observeHistogram(name, duration, labels);
      return result;
    } catch (error) {
      const duration = Number(process.hrtime.bigint() - start) / 1000000;
      this.observeHistogram(name, duration, { ...labels, error: "true" });
      throw error;
    }
  }

  /**
   * Create a timer that can be stopped manually
   */
  startTimer(name: string, labels?: Record<string, string>): () => void {
    const start = process.hrtime.bigint();

    return () => {
      const duration = Number(process.hrtime.bigint() - start) / 1000000;
      this.observeHistogram(name, duration, labels);
    };
  }

  /**
   * Get a specific metric
   */
  getMetric(name: string, labels?: Record<string, string>): Metric | undefined {
    const key = this.createKey(name, labels);
    return this.metrics.get(key);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, Metric> {
    const result: Record<string, Metric> = {};

    for (const [key, metric] of this.metrics.entries()) {
      result[key] = metric;
    }

    return result;
  }

  /**
   * Get metrics by prefix
   */
  getMetricsByPrefix(prefix: string): Record<string, Metric> {
    const result: Record<string, Metric> = {};

    for (const [key, metric] of this.metrics.entries()) {
      if (key.startsWith(prefix)) {
        result[key] = metric;
      }
    }

    return result;
  }

  /**
   * Get time series data for a metric
   */
  getTimeSeries(name: string, labels?: Record<string, string>): MetricValue[] {
    const key = this.createKey(name, labels);
    return this.timeSeries.get(key) || [];
  }

  /**
   * Get a snapshot of all metrics at current time
   */
  getSnapshot(): MetricsSnapshot {
    return {
      timestamp: Date.now(),
      metrics: this.getAllMetrics(),
    };
  }

  /**
   * Reset a specific metric
   */
  resetMetric(name: string, labels?: Record<string, string>): void {
    const key = this.createKey(name, labels);
    this.metrics.delete(key);
    this.timeSeries.delete(key);
  }

  /**
   * Reset all metrics
   */
  resetAllMetrics(): void {
    this.metrics.clear();
    this.timeSeries.clear();
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheus(): string {
    const lines: string[] = [];
    const metricsByName = new Map<
      string,
      Array<{ key: string; metric: Metric }>
    >();

    // Group metrics by name
    for (const [key, metric] of this.metrics.entries()) {
      const name = key.split("{")[0]; // Extract metric name without labels
      if (!metricsByName.has(name)) {
        metricsByName.set(name, []);
      }
      metricsByName.get(name)!.push({ key, metric });
    }

    // Export each metric type
    for (const [name, metricEntries] of metricsByName.entries()) {
      const firstMetric = metricEntries[0].metric;

      // Add help and type comments
      lines.push(`# HELP ${name} ${this.getMetricHelp(name)}`);
      lines.push(`# TYPE ${name} ${firstMetric.type}`);

      for (const { metric } of metricEntries) {
        const labelsStr = this.formatPrometheusLabels(metric.labels);

        if (metric.type === "counter" || metric.type === "gauge") {
          lines.push(`${name}${labelsStr} ${metric.value}`);
        } else if (metric.type === "histogram") {
          const hist = metric.histogram;

          // Export buckets
          for (const bucket of hist.buckets) {
            const bucketLabels = {
              ...metric.labels,
              le: bucket.upperBound.toString(),
            };
            const bucketLabelsStr = this.formatPrometheusLabels(bucketLabels);
            lines.push(`${name}_bucket${bucketLabelsStr} ${bucket.count}`);
          }

          // Export sum and count
          lines.push(`${name}_sum${labelsStr} ${hist.sum}`);
          lines.push(`${name}_count${labelsStr} ${hist.count}`);
        }
      }

      lines.push(""); // Empty line between metrics
    }

    return lines.join("\n");
  }

  /**
   * Register common Discord bot metrics
   */
  registerBotMetrics(): void {
    // API metrics
    this.incrementCounter("discord_api_requests_total", 0, {
      method: "GET",
      endpoint: "/users/@me",
    });
    this.setGauge("discord_api_rate_limit_remaining", 0, { bucket: "global" });
    this.observeHistogram("discord_api_request_duration_ms", 0, {
      method: "GET",
    });

    // Gateway metrics
    this.setGauge("discord_gateway_connected", 0);
    this.incrementCounter("discord_gateway_events_total", 0, {
      event: "MESSAGE_CREATE",
    });
    this.observeHistogram("discord_gateway_event_processing_duration_ms", 0, {
      event: "MESSAGE_CREATE",
    });

    // Bot metrics
    this.setGauge("discord_guilds_total", 0);
    this.setGauge("discord_users_total", 0);
    this.setGauge("discord_channels_total", 0);
    this.incrementCounter("discord_commands_executed_total", 0, {
      command: "ping",
    });
    this.observeHistogram("discord_command_duration_ms", 0, {
      command: "ping",
    });

    // Cache metrics
    this.setGauge("discord_cache_size", 0, { cache: "guilds" });
    this.incrementCounter("discord_cache_hits_total", 0, { cache: "guilds" });
    this.incrementCounter("discord_cache_misses_total", 0, { cache: "guilds" });

    // System metrics
    this.setGauge("nodejs_memory_usage_bytes", 0, { type: "rss" });
    this.setGauge("nodejs_cpu_usage_percent", 0);
    this.setGauge("nodejs_event_loop_lag_ms", 0);
  }

  /**
   * Update system metrics
   */
  updateSystemMetrics(): void {
    const memUsage = process.memoryUsage();
    this.setGauge("nodejs_memory_usage_bytes", memUsage.rss, { type: "rss" });
    this.setGauge("nodejs_memory_usage_bytes", memUsage.heapUsed, {
      type: "heap_used",
    });
    this.setGauge("nodejs_memory_usage_bytes", memUsage.heapTotal, {
      type: "heap_total",
    });
    this.setGauge("nodejs_memory_usage_bytes", memUsage.external, {
      type: "external",
    });

    const cpuUsage = process.cpuUsage();
    this.setGauge("nodejs_cpu_usage_microseconds", cpuUsage.user, {
      type: "user",
    });
    this.setGauge("nodejs_cpu_usage_microseconds", cpuUsage.system, {
      type: "system",
    });
  }

  /**
   * Create a unique key for metric with labels
   */
  private createKey(name: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name;
    }

    const labelPairs = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}="${value}"`)
      .join(",");

    return `${name}{${labelPairs}}`;
  }

  /**
   * Record time series data
   */
  private recordTimeSeries(
    key: string,
    value: number,
    labels?: Record<string, string>
  ): void {
    if (!this.timeSeries.has(key)) {
      this.timeSeries.set(key, []);
    }

    const series = this.timeSeries.get(key)!;
    series.push({
      value,
      timestamp: Date.now(),
      labels,
    });

    // Keep only recent data
    if (series.length > this.maxTimeSeriesLength) {
      series.splice(0, series.length - this.maxTimeSeriesLength);
    }
  }

  /**
   * Format labels for Prometheus export
   */
  private formatPrometheusLabels(labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return "";
    }

    const labelPairs = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}="${value.replace(/"/g, '\\"')}"`)
      .join(",");

    return `{${labelPairs}}`;
  }

  /**
   * Get help text for metric
   */
  private getMetricHelp(name: string): string {
    const helpTexts: Record<string, string> = {
      discord_api_requests_total: "Total number of Discord API requests",
      discord_api_rate_limit_remaining: "Remaining Discord API rate limit",
      discord_api_request_duration_ms:
        "Discord API request duration in milliseconds",
      discord_gateway_connected: "Whether the Discord gateway is connected",
      discord_gateway_events_total:
        "Total number of Discord gateway events received",
      discord_gateway_event_processing_duration_ms:
        "Time taken to process Discord gateway events",
      discord_guilds_total: "Total number of Discord guilds the bot is in",
      discord_users_total: "Total number of Discord users cached",
      discord_channels_total: "Total number of Discord channels cached",
      discord_commands_executed_total: "Total number of commands executed",
      discord_command_duration_ms: "Command execution duration in milliseconds",
      discord_cache_size: "Size of Discord cache",
      discord_cache_hits_total: "Total number of cache hits",
      discord_cache_misses_total: "Total number of cache misses",
      nodejs_memory_usage_bytes: "Node.js memory usage in bytes",
      nodejs_cpu_usage_percent: "Node.js CPU usage percentage",
      nodejs_cpu_usage_microseconds: "Node.js CPU usage in microseconds",
      nodejs_event_loop_lag_ms: "Node.js event loop lag in milliseconds",
    };

    return helpTexts[name] || `Metric ${name}`;
  }
}
