import os
import pymongo
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

CATEGORY_PRODUCT = os.getenv("CATEGORY_PRODUCT")
class DataLoader:
    def __init__(self, mongodb_url):
        self.mongodb_url = mongodb_url

    def load_dataset(self):
        client = pymongo.MongoClient(self.mongodb_url)
        db = client["products"]
        products_collection = db[CATEGORY_PRODUCT]

        data = products_collection.find(
            {},
            {"_id": 0, "title": 1, "categories": 1},
        ).limit(10000)
        # data = list(cursor)

        product_category_pairs = []
        for item in data:
            title = item["title"]
            category_titles = [category["categoryName"]
                               for category in item["categories"]]
            product_category_pairs.append([title, category_titles])

        product_data = pd.DataFrame(
            product_category_pairs,
            columns=["title", "categories"],
        )
        product_data["categories"] = product_data["categories"].apply(tuple)
        product_data_filtered = product_data.groupby("categories").filter(
            lambda x: len(x) > 4
        )
        return product_data_filtered
