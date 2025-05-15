# SynapseStream API Reference: Core Types

## Introduction
This document details the fundamental data types used within the SynapseStream framework for real-time neural network processing. These types govern data representation, stream configuration, and network architecture.

---

## Core Data Types

### `Tensor`
Represents multi-dimensional arrays used as primary data containers.

**Structure:**
```typescript
interface Tensor {
  dataType: 'float32' | 'int32' | 'uint8';
  shape: number[];
  buffer: ArrayBuffer;
  device: 'CPU' | 'GPU';
}
```

| Property | Type                   | Description                          |
|----------|------------------------|--------------------------------------|
| dataType | string                 | Precision format of tensor elements |
| shape    | number[]               | Dimensionality (e.g., [batch, features]) |
| buffer   | ArrayBuffer            | Raw data storage                     |
| device   | string                 | Memory allocation target             |

---

### `StreamBuffer`
Configures input data stream ingestion parameters.

**Structure:**
```typescript
interface StreamBuffer {
  bufferSize: number;
  samplingRate: number;
  maxLatency: number;
  preprocessors: TransformFunction[];
}
```

| Property       | Type                | Description                          |
|----------------|---------------------|--------------------------------------|
| bufferSize     | number              | Elements held in memory (power of 2) |
| samplingRate   | number              | Samples processed per second (Hz)    |
| maxLatency     | number              | Maximum tolerable delay (ms)         |
| preprocessors  | TransformFunction[] | Data transformation pipeline         |

---

## Stream Processing Types

### `TemporalWindow`
Defines time-based data segmentation.

**Structure:**
```typescript
interface TemporalWindow {
  windowSize: number;
  stride: number;
  unit: 'samples' | 'milliseconds';
}
```

| Property   | Type                  | Default  | Description                          |
|------------|-----------------------|----------|--------------------------------------|
| windowSize | number                | 1000     | Duration of data segment             |
| stride     | number                | 500      | Interval between window starts       |
| unit       | 'samples'/'ms'       | 'ms'     | Measurement basis for windowing      |

### `StreamSyncPolicy`
```typescript
type StreamSyncPolicy = 
  | 'strict_ordering' 
  | 'best_effort'
  | 'event_time';
```

---

## Network Components

### `LayerType`
```typescript
enum LayerType {
  Dense,
  Conv1D,
  LSTM,
  Attention,
  Dropout
}
```

### `LayerConfig`
```typescript
interface LayerConfig {
  layerType: LayerType;
  parameters: Map<string, number|string>;
  activation?: ActivationType;
}
```

### `ActivationType`
```typescript
enum ActivationType {
  ReLU,
  Sigmoid,
  Tanh,
  Softmax,
  LeakyReLU
}
```

---

## Optimization Types

### `OptimizerType`
```typescript
enum OptimizerType {
  SGD,
  Adam,
  RMSprop,
  Adagrad
}
```

### `OptimizerConfig`
```typescript
interface OptimizerConfig {
  optimizerType: OptimizerType;
  learningRate: number;
  momentum?: number;
  epsilon?: number;
}
```

| Property      | Type          | Default | Description                          |
|---------------|---------------|---------|--------------------------------------|
| optimizerType | OptimizerType | Adam    | Optimization algorithm               |
| learningRate  | number        | 0.001   | Step size for gradient updates       |
| momentum      | number        | 0.9     | SGD momentum factor (optional)       |
| epsilon       | number        | 1e-8    | Numerical stability constant (optional) |

---

## Error Handling

### `SynapseError`
```typescript
class SynapseError extends Error {
  code: string;
  context?: object;
  
  constructor(code: string, message: string, context?: object) {
    super(message);
    this.code = code;
    this.context = context;
  }
}
```

| Error Code            | Description                                       |
|-----------------------|---------------------------------------------------|
| INVALID_TENSOR_SHAPE  | Mismatched dimensions during tensor operations    |
| STREAM_TIMEOUT       | Data starvation beyond maxLatency threshold       |
| GPU_ALLOC_FAILURE    | Device memory exhaustion                          |

---

© SynapseStream Core Development Team. This documentation is licensed under CC-BY-NC-4.0.