# terraform/providers.tf
provider "google" {
  credentials = file("${var.GCP_SA_KEY_PATH}")
  project     = var.GCP_PROJECT_ID
  region      = var.GCP_REGION
}
