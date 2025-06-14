export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static startTiming(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, []);
      }
      
      const operationMetrics = this.metrics.get(operation)!;
      operationMetrics.push(duration);
      
      // Keep only the last 100 measurements
      if (operationMetrics.length > 100) {
        operationMetrics.shift();
      }
      
      console.log(`Performance: ${operation} took ${duration.toFixed(2)}ms`);
    };
  }

  static getAverageTime(operation: string): number {
    const metrics = this.metrics.get(operation);
    if (!metrics || metrics.length === 0) return 0;
    
    return metrics.reduce((sum, time) => sum + time, 0) / metrics.length;
  }

  static getAllMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    for (const [operation, times] of this.metrics.entries()) {
      if (times.length > 0) {
        result[operation] = {
          average: times.reduce((sum, time) => sum + time, 0) / times.length,
          count: times.length,
          latest: times[times.length - 1]
        };
      }
    }
    
    return result;
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}

// Helper function for easy performance monitoring
export const measurePerformance = <T>(
  operation: string,
  fn: () => T | Promise<T>
): T | Promise<T> => {
  const stopTiming = PerformanceMonitor.startTiming(operation);
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => stopTiming());
    } else {
      stopTiming();
      return result;
    }
  } catch (error) {
    stopTiming();
    throw error;
  }
};
