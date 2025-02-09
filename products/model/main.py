from utils.text_vectorizer import TextVectorizer
from models.model_trainer import ModelTrainer
from utils.multihot_encoder import MultiHotEncoder
from datasets.data_loader import DataLoader
import tensorflow as tf
import logging
from sklearn.model_selection import train_test_split
import pickle
from dotenv import load_dotenv
import os
from models.model_exporter import ModelExporter


def get_logger():
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
    )

    return logging.getLogger(__name__)


def get_env():
    load_dotenv()

    mongodb_url = os.getenv("MONGODB_URL")
    azure_env = {
        "account_url": os.getenv("AZURE_ML_ACCOUNT_URL"),
        "container_name": os.getenv("AZURE_ML_CONTAINER_NAME"),
        "blob_name": os.getenv("AZURE_ML_CATEGORY_BLOB_NAME"),
        "credential": os.getenv("AZURE_ML_CREDENTIAL"),
    }

    return mongodb_url, azure_env


def prepare_data(mongodb_url, test_split=0.1, test_val_split=0.5, random_state=43):
    data_loader = DataLoader(mongodb_url)
    product_data_filtered = data_loader.load_dataset()

    train_df, test_df = train_test_split(
        product_data_filtered,
        test_size=test_split,
        stratify=product_data_filtered["categories"].values,
        random_state=random_state,
    )

    val_df = test_df.sample(frac=test_val_split)
    test_df.drop(val_df.index, inplace=True)

    return train_df, val_df, test_df


def preprocess_data(dataset, text_vectorizer):
    return dataset.map(
        lambda text, label: (text_vectorizer.vectorize_text(text), label),
        num_parallel_calls=tf.data.AUTOTUNE,
    ).prefetch(tf.data.AUTOTUNE)


def prepare_vectorizer(train_df, train_dataset, logger):
    vocabulary = set()
    train_df["title"].str.lower().str.split().apply(vocabulary.update)
    vocabulary_size = len(vocabulary)
    logger.info(f"Abstract: {vocabulary_size}")
    text_vectorizer = TextVectorizer(vocabulary_size, 2)
    with tf.device("/GPU:0"):
        text_vectorizer.adapt_vectorizer(train_dataset.map(lambda text, label: text))

    return text_vectorizer


def train_model(model_trainer, train_dataset, validation_dataset, multi_hot_encoder):
    shallow_mlp_model = model_trainer.make_model(multi_hot_encoder.get_vocab_size())
    shallow_mlp_model = model_trainer.compile_and_train(
        shallow_mlp_model, train_dataset, validation_dataset
    )

    return shallow_mlp_model


def demo_inference(model_trainer, multi_hot_encoder, model_for_inference, test_df, batch_size, logger):
    # Create a small dataset just for demoing inference
    inference_dataset = model_trainer.make_dataset(
        test_df.sample(100), multi_hot_encoder, batch_size, is_train=False)
    text_batch, label_batch = next(iter(inference_dataset))
    predicted_probabilities = model_for_inference.predict(text_batch)
    # Perform a sample inference.
    for i, text in enumerate(text_batch[:5]):
        label = label_batch[i].numpy()[None, ...]
        logger.info(f"Abstract: {text}")
        logger.info(
            f"Label(s): {multi_hot_encoder.invert_multi_hot(label[0])}")
        top_3_labels = [
            x
            for _, x in sorted(
                zip(predicted_probabilities[i], multi_hot_encoder.get_vocab()),
                key=lambda pair: pair[0],
                reverse=True,
            )
        ][:3]
        logger.info(
            "Predicted Label(s): "
            + f"({', '.join([label for label in top_3_labels])})"
        )


def main():
    logger = get_logger();
    epochs = 5
    batch_size = 128
    saved_python_model_dir = "category_ml_model_python"
    mongodb_url, azure_env = get_env()

    train_df, val_df, test_df = prepare_data(mongodb_url)
    # Multi-label binarization
    terms = tf.ragged.constant(train_df["categories"].values)
    print(train_df["categories"].values)
    multi_hot_encoder = MultiHotEncoder(terms)
    # Data preprocessing
    model_trainer = ModelTrainer(batch_size, epochs, logger)
    train_dataset = model_trainer.make_dataset(train_df, multi_hot_encoder, batch_size, is_train=True)
    validation_dataset = model_trainer.make_dataset(val_df, multi_hot_encoder, batch_size, is_train=False)
    test_dataset = model_trainer.make_dataset(test_df, multi_hot_encoder, batch_size, is_train=False)
    # Vectorization
    text_vectorizer = prepare_vectorizer(train_df, train_dataset, logger)
    train_dataset = preprocess_data(train_dataset, text_vectorizer)
    validation_dataset = preprocess_data(validation_dataset, text_vectorizer)
    test_dataset = preprocess_data(test_dataset, text_vectorizer)
    # Training
    shallow_mlp_model = train_model(model_trainer, train_dataset, validation_dataset, multi_hot_encoder)
    # Evaluation
    model_trainer.evaluate_model(shallow_mlp_model, test_dataset)
    # Create a model for inference
    model_exporter = ModelExporter(
        text_vectorizer.get_vectorizer(),
        multi_hot_encoder.get_vocab(),
        shallow_mlp_model,
        logger,
    )
    model_for_inference = model_exporter.create_inference_model()
    demo_inference(
        model_trainer,
        multi_hot_encoder,
        model_for_inference,
        test_df,
        batch_size,
        logger
    )

    # Export python model to typescript and upload to Azure
    model_exporter.save_model('./categoryModel.h5')

    text_vectorizer_layer = text_vectorizer.get_vectorizer();

    pickle.dump({'config': text_vectorizer_layer.get_config(),
             'weights': text_vectorizer_layer.get_weights(),
             'vocabulary': text_vectorizer_layer.get_vocabulary(),
             'categories': train_df["categories"].values
             }
            , open("tv_layer.pkl", "wb"))


    pickle.dump({
             'vocabulary': text_vectorizer_layer.get_vocabulary(),
             }
            , open("vocab.pkl", "wb"))




    vt = text_vectorizer.vectorize_text(['while striped shirt'])

    model_path = './categoryModel'
    model = tf.keras.models.load_model(model_path)
    predictions = model.predict(vt)

    top_3_labels = [
            x
            for _, x in sorted(
                zip(predictions[0], multi_hot_encoder.get_vocab()),
                key=lambda pair: pair[0],
                reverse=True,
            )
        ][:3]

    # Print predictions
    print(top_3_labels)


# model_zip_file_path = model_exporter.export_model(
#     './categoryModel', './categoryModelts')
# model_exporter.upload_to_azure_blob(azure_env, model_zip_file_path)

if __name__ == "__main__":
    main()
