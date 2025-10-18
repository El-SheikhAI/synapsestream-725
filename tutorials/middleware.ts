/**
 * SynapseStream Middleware Tutorial
 * 
 * This tutorial demonstrates middleware implementation patterns within the SynapseStream framework.
 * Middleware enables pre-processing of real-time data streams before neural network ingestion.
 * 
 * Core Concepts:
 * 1. Middleware Chain Architecture
 * 2. Data Transformation Patterns
 * 3. Context Propagation
 * 4. Error Handling Strategies
 */

import { DataStreamContext, MiddlewareFunction, NeuralPipeline } from '@synapsestream/core';

// ========================
// 1. Basic Middleware Template
// ========================

/**
 * Interface defining middleware contract
 */
interface Middleware<T = any> {
  process: MiddlewareFunction<T>;
}

/**
 * Basic logging middleware implementation
 */
export class LoggingMiddleware implements Middleware {
  process = async (context: DataStreamContext, next: () => Promise<void>) => {
    console.log(`[${new Date().toISOString()}] Processing batch`, {
      id: context.streamId,
      size: context.payload.length
    });

    const start = performance.now();
    await next();
    const duration = performance.now() - start;

    console.log(`Processing completed in ${duration.toFixed(2)}ms`);
  };
}

// ===================================
// 2. Data Transformation Middleware
// ===================================

/**
 * Normalization middleware for feature scaling
 */
export class NormalizationMiddleware implements Middleware<number[]> {
  process = async (context: DataStreamContext, next: () => Promise<void>) => {
    context.payload = context.payload.map(batch => {
      const min = Math.min(...batch);
      const max = Math.max(...batch);
      return batch.map(value => (value - min) / (max - min));
    });

    await next();
  };
}

// ==================================
// 3. Temporal Processing Middleware
// ==================================

/**
 * Windowing middleware for time-series data
 */
export class WindowingMiddleware implements Middleware {
  private buffer: number[][] = [];

  constructor(
    private readonly windowSize: number = 10,
    private readonly stride: number = 5
  ) {}

  process = async (context: DataStreamContext, next: () => Promise<void>) => {
    this.buffer.push(...context.payload);
    
    while (this.buffer.length >= this.windowSize) {
      const window = this.buffer.slice(0, this.windowSize);
      context.payload = [window];
      
      await next();
      this.buffer = this.buffer.slice(this.stride);
    }

    context.payload = [];
  };
}

// ================================
// 4. Middleware Composition Pattern
// ================================

/**
 * Creates middleware pipeline with proper error handling
 */
export function createProcessingPipeline() {
  return new NeuralPipeline()
    .use(new LoggingMiddleware())
    .use(new WindowingMiddleware(8, 4))
    .use(new NormalizationMiddleware())
    .use(async (context, next) => {
      try {
        await next();
      } catch (error) {
        console.error('Processing pipeline failure:', error);
        context.metadata.failed = true;
        throw error;
      }
    });
}

// ========================
// Usage Example
// ========================

/**
 * End-to-end middleware implementation example
 */
export async function executeMiddlewareFlow() {
  const pipeline = createProcessingPipeline();
  const sampleContext: DataStreamContext = {
    streamId: 'sensor-123',
    payload: [[1, 20, 300], [4, 50, 600]],
    metadata: {}
  };

  await pipeline.execute(sampleContext);
}

// ================================
// Advanced Extension Pattern
// ================================

/**
 * Custom context extension demonstration
 */
declare module '@synapsestream/core' {
  interface DataStreamContext {
    analytics?: {
      processedCount: number;
      anomalyDetected: boolean;
    };
  }
}

/**
 * Analytics middleware using extended context
 */
export class AnalyticsMiddleware implements Middleware {
  process = async (context: DataStreamContext, next: () => Promise<void>) => {
    context.analytics = {
      processedCount: context.payload.length,
      anomalyDetected: false
    };

    await next();

    console.log('Processing metrics:', context.analytics);
  };
}

/**
 * This tutorial establishes fundamental middleware patterns,
 * providing extensible building blocks for stream processing.
 * 
 * Key Recommendations:
 * - Maintain middleware statelessness where possible
 * - Implement comprehensive error boundaries
 * - Use context judiciously for cross-cutting concerns
 * - Profile middleware performance characteristics
 */