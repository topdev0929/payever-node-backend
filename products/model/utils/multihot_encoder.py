import numpy as np
from tensorflow import keras


class MultiHotEncoder:
    def __init__(self, vocab):
        self.lookup = keras.layers.StringLookup(output_mode="multi_hot")
        self.lookup.adapt(vocab)

    def encode_labels(self, labels):
        return self.lookup(labels).numpy()

    def invert_multi_hot(self, encoded_labels):
        hot_indices = np.argwhere(encoded_labels == 1.0)[..., 0]
        return np.take(self.lookup.get_vocabulary(), hot_indices)

    def get_vocab(self):
        return self.lookup.get_vocabulary()
    
    def get_vocab_size(self):
        return self.lookup.vocabulary_size()