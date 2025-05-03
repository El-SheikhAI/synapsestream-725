# SynapseStream: Hello World Tutorial

## Introduction
This tutorial provides the foundational steps to create your first neural processing pipeline using SynapseStream. We'll demonstrate a minimal implementation that processes a continuous data stream through a neural network with real-time parameter updates.

## Prerequisites
- Python ≥3.8
- pip ≥21.3
- Basic understanding of neural networks

## Implementation Steps

### 1. Install SynapseStream Core
```bash
pip install synapsestream==1.0.4
```

### 2. Create Neural Processor
```python
from synapsestream import StreamingNN
import torch.nn as nn

class HelloWorldProcessor(StreamingNN):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(8, 4),
            nn.ReLU(),
            nn.Linear(4, 1),
            nn.Sigmoid()
        )
        self.configure_optimizer(learning_rate=0.01)

    def forward(self, x):
        return self.net(x)
```

### 3. Initialize Data Stream
```python
from synapsestream import ContinuousDataLoader
import numpy as np

def sample_generator():
    while True:
        yield (
            np.random.rand(8).astype(np.float32),
            np.random.randint(0, 2, size=(1,)).astype(np.float32)
        )

stream = ContinuousDataLoader(
    generator=sample_generator(),
    batch_size=32,
    max_queue_size=1000
)
```

### 4. Configure Processing Pipeline
```python
from synapsestream import StreamProcessor

processor = StreamProcessor(
    model=HelloWorldProcessor(),
    input_adapter=lambda x: x,
    output_adapter=lambda y: y.item()
)
```

### 5. Execute Stream Processing
```python
for batch in stream:
    outputs = processor.process(batch)
    print(f"Batch processed | Avg Output: {sum(outputs)/len(outputs):.4f}")

    # Runtime control (Ctrl+C to stop)
    stream.adaptive_throttle(target_latency=0.1)
```

## Key Concepts Demonstrated
1. **Continuous Processing**: 
   - The generator creates infinite synthetic data
   - `ContinuousDataLoader` handles stream buffering

2. **Adaptive Learning**: 
   - Automatic backpropagation during `process()`
   - Optimizer configuration via `configure_optimizer()`

3. **Runtime Controllers**:
   - `adaptive_throttle` regulates processing speed
   - Dynamic batch sizing maintains throughput

## Expected Output
```
Batch processed | Avg Output: 0.5123
Batch processed | Avg Output: 0.5241
Batch processed | Avg Output: 0.5687
...
```

## Next Steps
1. Replace sample generator with real data sources
2. Implement custom input/output adapters
3. Explore distributed processing in `StreamProcessor` config
4. Add monitoring hooks for performance metrics

View advanced examples in our [Stream Processing Cookbook](../advanced/cookbook.md).