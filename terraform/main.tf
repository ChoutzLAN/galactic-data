# terraform/main.tf
resource "google_cloud_run_service" "default" {
  name     = "galactic-data-service"
  location = var.GCP_REGION

  template {
    spec {
      containers {
        image = "gcr.io/${var.GCP_PROJECT_ID}/${var.DOCKER_IMAGE}:${var.IMAGE_TAG}"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
