# terraform/providers.tf
provider "google" {
  project     = var.GCP_PROJECT_ID
  region      = var.GCP_REGION
}
