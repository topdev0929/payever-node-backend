import os
import tempfile
import asyncio
import pickle
import logging
import threading
import tensorflow as tf
from flask import Flask, request, jsonify
from utils.multihot_encoder import MultiHotEncoder
from utils.azure_client import AzureClient
from dotenv import load_dotenv

def get_logger():
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
    )

    return logging.getLogger(__name__)


logger = get_logger()
load_dotenv()
app = Flask(__name__)
PORT = os.getenv('PREDICTION_API_PORT', 5000)

temp_dir = tempfile.gettempdir()

text_vectorizer_data_file_name = os.getenv("AZURE_ML_CATEGORY_TEXT_VECTORIZER_DATA_FILE")
text_vectorizer_data_file_path = os.path.join(temp_dir, text_vectorizer_data_file_name)
model_file_name = os.getenv("AZURE_ML_CATEGORY_BLOB_NAME")
model_file_path = os.path.join(temp_dir, model_file_name)

azureClient = AzureClient()

loading_model = False
loaded_model = None
text_vectorizer = None
multi_hot_encoder = None
model_loaded = False

def loadModel():
    global loading_model
    global loaded_model
    global text_vectorizer
    global multi_hot_encoder
    global model_loaded

    if (model_loaded):
        return

    loading_model = True

    if (not os.path.exists(text_vectorizer_data_file_path)):
        logger.info(f"Downloading {text_vectorizer_data_file_name} from Azure blob storage")
        asyncio.run(azureClient.download_to_path(text_vectorizer_data_file_path, blob=text_vectorizer_data_file_name))
    else:
        logger.info(f"Found {text_vectorizer_data_file_path} in temp directory")

    if (not os.path.exists(model_file_path)):
        logger.info(f"Downloading {model_file_name} from Azure blob storage")
        asyncio.run(azureClient.download_to_path(model_file_path, blob=model_file_name))
    else:
        logger.info(f"Found {model_file_path} in temp directory")

    # Load the text vectorization configuration
    if (not text_vectorizer):
        from_disk = pickle.load(open(text_vectorizer_data_file_path, "rb"))
        text_vectorizer = tf.keras.layers.TextVectorization.from_config(from_disk['config'])
        text_vectorizer.set_vocabulary(from_disk['vocabulary'], idf_weights=from_disk['weights'][0])
        logger.info(f"Loaded text vectorizer from {text_vectorizer_data_file_path}")

    # Load model
    if (not loaded_model):
        loaded_model = tf.keras.models.load_model(model_file_path)
        logger.info(f"Loaded model from {model_file_path}")


    # Load the category encoder
    if (not multi_hot_encoder):
        terms = tf.ragged.constant(from_disk['categories'])
        multi_hot_encoder = MultiHotEncoder(terms)
        logger.info(f"Loaded category encoder")

    loading_model = False
    model_loaded = True

    if os.path.exists(text_vectorizer_data_file_path):
        os.remove(text_vectorizer_data_file_path)
        print(f"Deleted file: {text_vectorizer_data_file_path}")

    if os.path.exists(model_file_path):
        os.remove(model_file_path)
        print(f"Deleted file: {model_file_path}")


@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({'status': 'OK'})

@app.route('/api/predict_category', methods=['GET'])
def predict_category():
    global loading_model
    try:

        # if (loading_model):
        #     logger.info('test1')
        #     return jsonify({'error': 'Model is loading. Please try again in a few seconds.'})

        # if (not loaded_model or not text_vectorizer or not multi_hot_encoder):
        #     logger.info('test2')
        #     loadModel()
        #     return jsonify({'error': 'Model is loading. Please try again in a few seconds.'})


        # Get input data from the request body
        data = request.args.get('title')
        input_title = data

        logger.info(f"Predicting category for {input_title}")

        # Vectorize the input text
        vt = text_vectorizer([input_title])

        # Make predictions
        predictions = loaded_model.predict(vt)

        # Get the top category labels
        top_3_labels = [
            x
            for _, x in sorted(
                zip(predictions[0], multi_hot_encoder.get_vocab()),
                key=lambda pair: pair[0],
                reverse=True,
            )
        ][:3]

        logger.info(f"Predicted category for {input_title}: {top_3_labels}")

        return jsonify({'predictions': top_3_labels})

    except Exception as e:
        logger.error(f"Error predicting category {e}")
        loading_model = False
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    threading.Thread(target=loadModel).start()
    app.run(debug=True, host="0.0.0.0", port=PORT)
