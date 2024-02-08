# terraform/main.tf
resource "google_cloud_run_service" "default" {
  name     = "galactic-data-service"
  location = var.GCP_REGION

  template {
    spec {
      containers {
        image = "australia-southeast1-docker.pkg.dev/${var.GCP_PROJECT_ID}/galactic-data-artifact-registry-0/${var.DOCKER_IMAGE}:${var.IMAGE_TAG}"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
