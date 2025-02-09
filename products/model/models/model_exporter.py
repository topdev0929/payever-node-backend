import pickle
import shutil
import os
from tensorflowjs.converters import convert_tf_saved_model
from tensorflow import keras
import tensorflow as tf
from azure.storage.blob import BlobClient

class ModelExporter:
    def __init__(self, text_vectorizer, vocab, shallow_mlp_model, logger):
        self.text_vectorizer = text_vectorizer
        self.vocab = vocab
        self.shallow_mlp_model = shallow_mlp_model
        self.logger = logger

    def create_inference_model(self):
        model_for_inference = keras.Sequential(
            [self.text_vectorizer, self.shallow_mlp_model])
        return model_for_inference

    def save_model(self, root_dir):
        self.shallow_mlp_model.save(root_dir);
        tf.keras.models.save_model(model=self.shallow_mlp_model, filepath=root_dir)
        self.logger.info(f"Python model saved to {root_dir}")
        return root_dir

    def export_model(self, root_dir, model_dir_name):
        # category_ml_model_python_dir = os.path.join(root_dir, model_dir_name)
        # category_ml_model_zip_path_no_extension = os.path.join(
        #     root_dir, "category_ml_model")
        # category_ml_model_zip_path = category_ml_model_zip_path_no_extension + ".zip"
        # category_ml_model_typescript_dir = os.path.join(root_dir, "category_ml_model")
        convert_tf_saved_model(
            saved_model_dir=root_dir,
            output_dir=model_dir_name,
        )

        with open(os.path.join(
            model_dir_name, "vocab.pkl"), "wb") as vocab_file:
            pickle.dump(self.vocab, vocab_file)

        self.logger.info(
            f"Typescript model and vocab saved to {model_dir_name}")
        shutil.make_archive(
            base_name=model_dir_name + ".zip",
            format="zip",
            root_dir=model_dir_name,
            logger=self.logger,
        )
        # self.logger.info(
        #     f"{category_ml_model_typescript_dir} compressed to {category_ml_model_zip_path}")
        # return category_ml_model_zip_path

    def upload_to_azure_blob(self, env, category_ml_model_zip_path):
        blob = BlobClient(
            account_url=env["account_url"],
            container_name=env["container_name"],
            blob_name=env["blob_name"],
            credential=env["credential"],
        )

        with open(category_ml_model_zip_path, "rb") as data:
            self.logger.info(
                f"Uploading {category_ml_model_zip_path} to Azure Blob Storage...")
            blob.upload_blob(data, overwrite=True)

        self.logger.info(
            f"Successfully uploaded {category_ml_model_zip_path} to Azure Blob Storage")
