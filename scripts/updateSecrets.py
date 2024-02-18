import os
from google.cloud import secretmanager
from dotenv import load_dotenv

# Load the local .env file
load_dotenv()

# Initialize the Secret Manager client
client = secretmanager.SecretManagerServiceClient()

# Your Google Cloud project ID
project_id = os.getenv('GCP_POOL_ID')

def update_secret(secret_id, secret_value):
    # Construct the resource name of the secret
    parent = f"projects/{project_id}"
    secret_name = f"{parent}/secrets/{secret_id}/versions/latest"
    
    # Access the secret version
    try:
        response = client.access_secret_version(name=secret_name)
        # Update the secret version if it exists
        client.add_secret_version(parent=secret_name, payload={"data": secret_value.encode()})
        print(f"Updated secret: {secret_id}")
    except Exception as e:
        print(f"Could not update secret {secret_id}. Error: {e}")

def main():
    for key, value in os.environ.items():
        if key.startswith('SECRET_'):
            # Update secrets in Google Cloud Secret Manager
            secret_id = key[7:]  # Remove 'SECRET_' prefix
            update_secret(secret_id, value)
        else:
            # Print non-secret variables for verification
            print(f"Non-secret variable: {key}={value}")

if __name__ == "__main__":
    main()
