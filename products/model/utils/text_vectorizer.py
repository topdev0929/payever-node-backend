from tensorflow import keras


class TextVectorizer:
    def __init__(self, max_tokens, ngrams):
        self.max_tokens = max_tokens # vocab size
        self.ngrams = ngrams
        self.text_vectorizer = keras.layers.TextVectorization(
            max_tokens=self.max_tokens, ngrams=self.ngrams, output_mode="tf_idf"
        )

    def adapt_vectorizer(self, dataset):
        self.text_vectorizer.adapt(dataset)

    def vectorize_text(self, text):
        return self.text_vectorizer(text)

    def get_vectorizer(self):
        return self.text_vectorizer