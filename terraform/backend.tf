terraform {
  backend "gcs" {
    bucket = "your-terraform-state-bucket-name"
    prefix = "path/to/state/files"
  }
}
