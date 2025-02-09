from tensorflow import keras
import tensorflow as tf


class ModelTrainer:
    def __init__(self, batch_size, epochs, logger):
        self.batch_size = batch_size
        self.epochs = epochs
        self.logger = logger

    def make_model(self, vocab_size):
        shallow_mlp_model = keras.Sequential(
            [
                keras.layers.Dense(512, activation="relu"),
                keras.layers.Dense(256, activation="relu"),
                keras.layers.Dense(vocab_size, activation="sigmoid"),
            ]
        )
        return shallow_mlp_model

    def make_dataset(self, data_frame, encoder, batch_size, is_train=True):
        """Creates a dataset using binarization of text."""
        labels = tf.ragged.constant(data_frame["categories"].values)
        label_binarized = encoder.encode_labels(labels)
        dataset = tf.data.Dataset.from_tensor_slices(
            (data_frame["title"].values, label_binarized)
        )
        dataset = dataset.shuffle(batch_size * 10) if is_train else dataset
        return dataset.batch(batch_size)

    def compile_and_train(self, model, train_dataset, validation_dataset):
        model.compile(
            loss="binary_crossentropy", optimizer="adam", metrics=["binary_accuracy"]
        )
        model.fit(
            train_dataset,
            validation_data=validation_dataset,
            epochs=self.epochs,
        )
        return model

    def evaluate_model(self, model, test_dataset):
        _, binary_acc = model.evaluate(test_dataset)
        self.logger.info(
            f"Categorical accuracy on the test set: {round(binary_acc * 100, 2)}%.")
        return binary_acc
