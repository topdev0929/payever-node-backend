import logging
import os
from azure.storage.blob import ContainerClient

class AzureClient:
    def __init__(self):
        self.blob_url = os.getenv("AZURE_ML_ACCOUNT_URL")
        self.container_name = os.getenv("AZURE_ML_CONTAINER_NAME")
        self.connection_string = os.getenv("AZURE_ML_CONNECTION_STRING")
        self.container_client = ContainerClient.from_container_url(self.connection_string)
        self.logger = logging.getLogger('AzureClient')

    async def download_to_path(self, path, blob=None):
        self.logger.info({
            'action': 'download',
            'blockBlob': blob,
            'connectionString': self.connection_string,
            'containerName': self.container_name,
            'filePath': path,
        })

        block_blob_client = self.container_client.get_blob_client(blob)
        with open(path, 'wb') as data:
            data.write(block_blob_client.download_blob().readall())

        self.logger.info(f"Downloaded block blob {blob} successfully to {path}", extra={'context': 'AzureClient'})
