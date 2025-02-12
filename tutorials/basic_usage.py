"""
SynapseStream Basic Usage Tutorial
==================================

This tutorial demonstrates core functionality of the SynapseStream framework 
for real-time neural network processing on continuous data streams. 

Key concepts covered:
- Stream initialization 
- Neural network configuration
- Continuous inference
- Online learning

Academic References:
[1] Wang et al. "Continuous Learning in Neural Networks" JMLR 2023
[2] Nguyen & Patel. "Stream Processing Architectures" NeurIPS 2022
"""

from synapse.stream import DataStream
from synapse.core import NeuralNetwork
from synapse.processors import StreamProcessor

# Initialize a sample data stream (simulated sensor input)
def create_sample_stream():
    """Generates synthetic multivariate time-series data"""
    return DataStream.synthetic(
        features=5, 
        temporal_dim=128,
        sample_rate=1000,
        patterns=['periodic', 'trend']
    )

# Basic processing workflow
def basic_processing_example():
    """End-to-end stream processing demonstration"""
    
    # 1. Network configuration
    network = NeuralNetwork(
        topology=[
            ('temporal_conv', {'filters': 64, 'kernel_size': 8}),
            ('lstm', {'units': 128}),
            ('dense', {'units': 32, 'activation': 'relu'}),
            ('output', {'units': 1, 'activation': 'linear'})
        ],
        learning_mode='online',
        optimizer='rmsprop'
    )
    
    # 2. Stream initialization
    stream = create_sample_stream()
    window_config = {
        'window_size': 256,
        'stride': 64,
        'preprocessing': [
            'normalize',
            'detrend'
        ]
    }
    
    # 3. Processor instantiation
    processor = StreamProcessor(
        network=network,
        stream=stream,
        window_config=window_config,
        metrics=['mae', 'mse']
    )
    
    # 4. Real-time processing loop
    try:
        for batch in processor.stream_batches(batch_size=32):
            # Inference phase
            predictions = processor.infer(batch)
            
            # Online learning (simulated labels)
            targets = generate_synthetic_targets(batch)  # Placeholder implementation
            processor.update(batch, targets)
            
            # Monitoring
            print(f"Batch MAE: {processor.current_metrics['mae']:.4f}")
            
    except KeyboardInterrupt:
        print("\nGraceful shutdown initiated...")
        
    finally:
        # Cleanup resources
        processor.close()
        network.save('./checkpoints/latest_model.sync')
        
def generate_synthetic_targets(batch):
    """Placeholder target generation function"""
    return np.random.uniform(0, 1, (batch.shape[0], 1))

if __name__ == "__main__":
    basic_processing_example()
    print("Tutorial completed successfully.")